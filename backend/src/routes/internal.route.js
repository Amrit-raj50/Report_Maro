// routes/internal.routes.js
const express = require('express');
const crypto = require('crypto');
const { updateProblemAI } = require('../controllers/internal.controller');

const router = express.Router();

// 🔑 Timing-safe internal API key verification middleware
const verifyInternalApiKey = (req, res, next) => {
  const apiKey = req.headers['x-internal-api-key'];
  const expectedKey = process.env.INTERNAL_API_KEY;

  if (!apiKey || !expectedKey) {
    console.error('❌ [Internal] Missing API key or INTERNAL_API_KEY not configured');
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid internal API key',
    });
  }

  const keyBuffer = Buffer.from(apiKey);
  const expectedBuffer = Buffer.from(expectedKey);

  if (
    keyBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(keyBuffer, expectedBuffer)
  ) {
    console.error('❌ [Internal] Invalid API key attempt');
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid internal API key',
    });
  }

  next();
};

// 🔑 Internal API - AI Worker only
router.patch('/problems/:id', verifyInternalApiKey, updateProblemAI);

module.exports = router;