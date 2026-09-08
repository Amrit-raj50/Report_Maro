// routes/project.routes.js
const express = require('express');
const { submitProposal, fundProject } = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middlewre');

const router = express.Router();

// University: Submit proposal
router.post('/:id/proposal',authMiddleware,rbacMiddleware(['university']),submitProposal);

// Industry: Fund project
router.put('/:id/fund',authMiddleware,rbacMiddleware(['industry']),fundProject);

module.exports = router;