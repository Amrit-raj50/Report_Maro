// src/services/bhashini.service.js
const axios = require('axios');

let cachedConfig = null;

async function getPipelineConfig() {
  if (cachedConfig) return cachedConfig;

  // Check for required env vars before making any network request
  if (!process.env.BHASHINI_USER_ID || !process.env.BHASHINI_UDYAT_KEY || !process.env.BHASHINI_PIPELINE_ID) {
    throw new Error('Bhashini env vars missing: BHASHINI_USER_ID, BHASHINI_UDYAT_KEY, BHASHINI_PIPELINE_ID');
  }

  const response = await axios.post(
    'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline',
    {
      pipelineTasks: [{ taskType: 'tts' }, { taskType: 'asr' }],
      pipelineRequestConfig: { pipelineId: process.env.BHASHINI_PIPELINE_ID },
    },
    {
      headers: {
        userID: process.env.BHASHINI_USER_ID,
        ulcaApiKey: process.env.BHASHINI_UDYAT_KEY,
      },
      timeout: 10000,
    }
  );

  const { pipelineInferenceAPIEndPoint, pipelineResponseConfig } = response.data;
  cachedConfig = {
    callbackUrl: pipelineInferenceAPIEndPoint.callbackUrl,
    inferenceKey: pipelineInferenceAPIEndPoint.inferenceApiKey?.value || process.env.BHASHINI_INFERENCE_KEY,
    serviceIds: {
      tts: pipelineResponseConfig.find(p => p.taskType === 'tts')?.config?.[0]?.serviceId || null,
      asr: pipelineResponseConfig.find(p => p.taskType === 'asr')?.config?.[0]?.serviceId || null,
    },
  };
  console.log('✅ [Bhashini] Pipeline config loaded:', cachedConfig.callbackUrl);
  return cachedConfig;
}

async function textToSpeech(text, sourceLanguage = 'hi') {
  const cfg = await getPipelineConfig();
  const res = await axios.post(
    cfg.callbackUrl,
    {
      pipelineTasks: [{
        taskType: 'tts',
        config: {
          serviceId: cfg.serviceIds.tts,
          language: { sourceLanguage },
          gender: 'female',
        },
      }],
      inputData: { input: [{ source: text }] },
    },
    {
      headers: { Authorization: cfg.inferenceKey },
      timeout: 15000,
    }
  );
  return res.data.pipelineResponse[0].audio[0].audioContent;
}

async function speechToText(base64Audio, sourceLanguage = 'hi') {
  const cfg = await getPipelineConfig();
  const res = await axios.post(
    cfg.callbackUrl,
    {
      pipelineTasks: [{
        taskType: 'asr',
        config: {
          serviceId: cfg.serviceIds.asr,
          language: { sourceLanguage },
        },
      }],
      inputData: { audio: [{ audioContent: base64Audio }] },
    },
    {
      headers: { Authorization: cfg.inferenceKey },
      timeout: 15000,
    }
  );
  return res.data.pipelineResponse[0].output[0].source;
}

// Reset cached config (useful if keys are rotated)
function resetCache() {
  cachedConfig = null;
}

module.exports = { getPipelineConfig, textToSpeech, speechToText, resetCache };
