const axios = require('axios');

let cachedConfig = null;
const INFERENCE_KEY_HEADER = 'Authorization'; // ⚠️ Developer Docs se confirm karna baaki hai

async function getPipelineConfig() {
  if (cachedConfig) return cachedConfig;

  const response = await axios.post(
    'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline',
    {
      pipelineTasks: [{ taskType: 'asr' }, { taskType: 'translation' }, { taskType: 'tts' }],
      pipelineRequestConfig: { pipelineId: process.env.BHASHINI_PIPELINE_ID },
    },
    {
      headers: {
        userID: process.env.BHASHINI_USER_ID,
        ulcaApiKey: process.env.BHASHINI_UDYAT_KEY,
      },
    }
  );

  const { pipelineInferenceAPIEndPoint, pipelineResponseConfig } = response.data;
  cachedConfig = {
    callbackUrl: pipelineInferenceAPIEndPoint.callbackUrl,
    serviceIds: {
      asr: pipelineResponseConfig[0].config[0].serviceId,
      translation: pipelineResponseConfig[1].config[0].serviceId,
      tts: pipelineResponseConfig[2].config[0].serviceId,
    },
  };
  return cachedConfig;
}

async function textToSpeech(text, sourceLanguage = 'hi') {
  const cfg = await getPipelineConfig();
  const res = await axios.post(
    cfg.callbackUrl,
    {
      pipelineTasks: [{
        taskType: 'tts',
        config: { serviceId: cfg.serviceIds.tts, language: { sourceLanguage } },
      }],
      inputData: { input: [{ source: text }] },
    },
    { headers: { [INFERENCE_KEY_HEADER]: process.env.BHASHINI_INFERENCE_KEY } }
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
        config: { serviceId: cfg.serviceIds.asr, language: { sourceLanguage } },
      }],
      inputData: { audio: [{ audioContent: base64Audio }] },
    },
    { headers: { [INFERENCE_KEY_HEADER]: process.env.BHASHINI_INFERENCE_KEY } }
  );
  return res.data.pipelineResponse[0].output[0].source;
}

module.exports = { getPipelineConfig, textToSpeech, speechToText };