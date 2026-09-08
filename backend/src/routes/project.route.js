// routes/project.routes.js
const express = require('express');
const { getProjects, getProjectById, submitProposal, fundProject } = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middlewre');

const router = express.Router();

// Additive: list/detail so universities and industries can actually see
// projects (see controllers/project.controller.js for why these were added)
router.get('/', authMiddleware, getProjects);
router.get('/:id', authMiddleware, getProjectById);

// University: Submit proposal
router.post(
  '/:id/proposal',
  authMiddleware,
  rbacMiddleware(['university']),
  submitProposal
);

// Industry: Fund project
router.put(
  '/:id/fund',
  authMiddleware,
  rbacMiddleware(['industry']),
  fundProject
);

module.exports = router;