// src/services/bhashini.service.js
const axios = require('axios');

const INFERENCE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
const PIPELINE_CONFIG_URL = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';

// Known working serviceIds for Bhashini pipeline (fallback when MeitY config API is slow/down)
const DEFAULT_SERVICE_IDS = {
  tts: {
    hi: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
    en: 'ai4bharat/indic-tts-coqui-misc-gpu--t4',
    bn: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
    or: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
    bho: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
    sat: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
    anp: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
    mai: 'ai4bharat/indic-tts-coqui-indo_aryan-gpu--t4',
  },
  asr: {
    hi: 'ai4bharat/conformer-hi-gpu--t4',
    en: 'ai4bharat/whisper-medium-en--gpu--t4',
    bn: 'ai4bharat/conformer-multilingual-indo_aryan-gpu--t4',
    or: 'ai4bharat/conformer-multilingual-indo_aryan-gpu--t4',
    bho: 'ai4bharat/conformer-multilingual-indo_aryan-gpu--t4',
    sat: 'ai4bharat/conformer-multilingual-indo_aryan-gpu--t4',
    anp: 'ai4bharat/conformer-multilingual-indo_aryan-gpu--t4',
    mai: 'ai4bharat/conformer-multilingual-indo_aryan-gpu--t4',
    ur: 'ai4bharat/conformer-multilingual-indo_aryan-gpu--t4',
  },
};

const serviceIdCache = new Map();

// Supported native TTS & ASR languages in Bhashini (Hindi, English, Bengali, Odia, Bhojpuri, Santhali, Angika, Khortha, Nagpuri, Magahi, Maithili, Kurukh, Urdu)
const SUPPORTED_TTS_LANGS = [
  'hi', 'en', 'bn', 'or', 'bho', 'sat', 'anp', 'kht', 'nag', 'mag', 'mai', 'kru'
];
const SUPPORTED_ASR_LANGS = [
  'hi', 'en', 'bn', 'or', 'bho', 'sat', 'anp', 'kht', 'nag', 'mag', 'mai', 'kru', 'ur'
];

const BHASHINI_TTS_PIPELINE_MAP = {
  bn: 'bn',
  or: 'or',
  en: 'en',
  hi: 'hi',
  bho: 'hi',
  sat: 'hi',
  anp: 'hi',
  kht: 'hi',
  nag: 'hi',
  mag: 'hi',
  mai: 'hi',
  kru: 'hi',
};

function resolveLanguage(lang, supportedList) {
  if (!lang) return 'hi';
  const cleanLang = String(lang).trim().toLowerCase();
  const mapped = BHASHINI_TTS_PIPELINE_MAP[cleanLang] || cleanLang;
  return supportedList.includes(mapped) ? mapped : 'hi';
}

async function getServiceId(taskType, language) {
  const cacheKey = `${taskType}_${language}`;
  if (serviceIdCache.has(cacheKey)) {
    return serviceIdCache.get(cacheKey);
  }

  const userId = process.env.BHASHINI_USER_ID;
  const inferenceKey = process.env.BHASHINI_INFERENCE_KEY;
  const pipelineId = process.env.BHASHINI_PIPELINE_ID || '64392f96daac500b55c543cd';

  if (userId && inferenceKey) {
    try {
      const response = await axios.post(
        PIPELINE_CONFIG_URL,
        {
          pipelineTasks: [{ taskType, config: { language: { sourceLanguage: language } } }],
          pipelineRequestConfig: { pipelineId },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            userID: userId,
            Authorization: inferenceKey,
          },
          timeout: 8000,
        }
      );

      const serviceId = response.data?.pipelineResponseConfig?.[0]?.config?.[0]?.serviceId;
      if (serviceId) {
        serviceIdCache.set(cacheKey, serviceId);
        return serviceId;
      }
    } catch (err) {
      console.warn(
        `[Bhashini] Failed to fetch dynamic serviceId for ${taskType}/${language}, using fallback:`,
        err.response?.data?.message || err.message
      );
    }
  }

  const fallback = DEFAULT_SERVICE_IDS[taskType]?.[language] || DEFAULT_SERVICE_IDS[taskType]?.['hi'];
  if (fallback) {
    serviceIdCache.set(cacheKey, fallback);
    return fallback;
  }

  throw new Error(`No serviceId found for ${taskType} in ${language}`);
}

async function getPipelineConfig() {
  const userId = process.env.BHASHINI_USER_ID;
  const inferenceKey = process.env.BHASHINI_INFERENCE_KEY;
  if (!userId || !inferenceKey) {
    throw new Error('Bhashini credentials missing in env: BHASHINI_USER_ID or BHASHINI_INFERENCE_KEY');
  }

  return {
    callbackUrl: INFERENCE_URL,
    inferenceKey,
    serviceIds: {
      tts: await getServiceId('tts', 'hi'),
      asr: await getServiceId('asr', 'hi'),
    },
  };
}

async function callBhashiniTts(text, targetLang) {
  const serviceId = await getServiceId('tts', targetLang);
  const inferenceKey = process.env.BHASHINI_INFERENCE_KEY;
  const userId = process.env.BHASHINI_USER_ID;

  if (!inferenceKey || !userId) {
    throw new Error('Bhashini env vars missing: BHASHINI_USER_ID or BHASHINI_INFERENCE_KEY');
  }

  const res = await axios.post(
    INFERENCE_URL,
    {
      pipelineTasks: [{
        taskType: 'tts',
        config: {
          serviceId,
          language: { sourceLanguage: targetLang },
          gender: 'female',
        },
      }],
      inputData: { input: [{ source: text.trim() }] },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: inferenceKey,
        userID: userId,
      },
      timeout: 20000,
    }
  );

  const audioContent = res.data?.pipelineResponse?.[0]?.audio?.[0]?.audioContent;
  if (!audioContent) {
    throw new Error(`Bhashini TTS returned empty audio payload for language ${targetLang}`);
  }

  return audioContent;
}

async function textToSpeech(text, sourceLanguage = 'hi') {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Text is required for TTS');
  }

  const effectiveLang = resolveLanguage(sourceLanguage, SUPPORTED_TTS_LANGS);
  
  try {
    return await callBhashiniTts(text, effectiveLang);
  } catch (err) {
    // If a regional dialect (e.g. anp, bho, sat, or) fails on Bhashini API, try Hindi fallback
    if (effectiveLang !== 'hi') {
      console.warn(`[Bhashini] Regional TTS (${effectiveLang}) failed, retrying with Hindi fallback:`, err.message);
      try {
        return await callBhashiniTts(text, 'hi');
      } catch (fallbackErr) {
        throw err;
      }
    }
    throw err;
  }
}

async function speechToText(base64Audio, sourceLanguage = 'hi') {
  if (!base64Audio) {
    throw new Error('Audio data is required for ASR');
  }

  const effectiveLang = resolveLanguage(sourceLanguage, SUPPORTED_ASR_LANGS);
  const serviceId = await getServiceId('asr', effectiveLang);

  const inferenceKey = process.env.BHASHINI_INFERENCE_KEY;
  const userId = process.env.BHASHINI_USER_ID;

  if (!inferenceKey || !userId) {
    throw new Error('Bhashini env vars missing: BHASHINI_USER_ID or BHASHINI_INFERENCE_KEY');
  }

  const res = await axios.post(
    INFERENCE_URL,
    {
      pipelineTasks: [{
        taskType: 'asr',
        config: {
          serviceId,
          language: { sourceLanguage: effectiveLang },
        },
      }],
      inputData: { audio: [{ audioContent: base64Audio }] },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: inferenceKey,
        userID: userId,
      },
      timeout: 20000,
    }
  );

  const source = res.data?.pipelineResponse?.[0]?.output?.[0]?.source;
  return source || '';
}

function resetCache() {
  serviceIdCache.clear();
}

module.exports = { getPipelineConfig, textToSpeech, speechToText, resetCache };
