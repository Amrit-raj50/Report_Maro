const express = require('express');
const { getGovernmentStats, getGovernmentChallenges, exportCsv } = require('../controllers/government.controller');

const router = express.Router();

// GET /api/government/dashboard-stats
router.get('/dashboard-stats', getGovernmentStats);

// GET /api/government/challenges
router.get('/challenges', getGovernmentChallenges);

// GET /api/government/export-csv
router.get('/export-csv', exportCsv);

module.exports = router;
