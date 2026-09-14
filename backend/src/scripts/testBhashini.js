require('dotenv').config();
const { getPipelineConfig, textToSpeech } = require('../services/bhashini.service');

(async () => {
  try {
    console.log('Testing pipeline config...');
    const cfg = await getPipelineConfig();
    console.log('✅ Pipeline config fetched:', JSON.stringify(cfg, null, 2));

    console.log('\nTesting TTS...');
    const audio = await textToSpeech('नमस्ते, यह एक परीक्षण है', 'hi');
    console.log('✅ TTS success, audio length:', audio.length);
  } catch (err) {
    console.error('❌ Failed:', err.response?.data || err.message);
  }
})();