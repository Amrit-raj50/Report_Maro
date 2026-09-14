const router = require('express').Router();
const voiceController = require('../controllers/voice.controller');

router.post('/tts', voiceController.tts);
router.post('/asr', voiceController.asr);

module.exports = router;