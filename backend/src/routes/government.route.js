const express = require('express');
const { getGovernmentStats, getGovernmentChallenges } = require('../controllers/government.controller');

const router = express.Router();

// Public endpoint for the hackathon demo dashboard
router.get('/dashboard-stats', getGovernmentStats);
router.get('/challenges', getGovernmentChallenges);

module.exports = router;
