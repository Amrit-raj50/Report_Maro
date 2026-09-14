const bhashiniService = require('../services/bhashini.service');

exports.tts = async (req, res) => {
  try {
    const { text, language } = req.body;
    const audioBase64 = await bhashiniService.textToSpeech(text, language);
    res.json({ audio: audioBase64 });
  } catch (err) {
    console.error('TTS error:', err.response?.data || err.message);
    res.status(502).json({ error: 'tts_failed' });
  }
};

exports.asr = async (req, res) => {
  try {
    const { audioBase64, language } = req.body;
    const text = await bhashiniService.speechToText(audioBase64, language);
    res.json({ text });
  } catch (err) {
    console.error('ASR error:', err.response?.data || err.message);
    res.status(502).json({ error: 'asr_failed' });
  }
};