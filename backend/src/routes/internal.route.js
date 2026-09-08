// routes/internal.routes.js
const express = require('express');
const { updateProblemAI } = require('../controllers/internal.controller');

const router = express.Router();

// 🔑 Internal API - AI Worker only
router.patch('/problems/:id', (req, res, next) => {
  const apiKey = req.headers['x-internal-api-key'];

  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    console.error('❌ [Internal] Invalid API key attempt');
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid internal API key',
    });
  }

  next();
}, updateProblemAI);

module.exports = router;