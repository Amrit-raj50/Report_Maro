// routes/problem.routes.js
const express = require('express');
const {
  createProblem,
  getProblems,
  getProblemById,
  assignProblem,
  getStats,
} = require('../controllers/problem.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rbacMiddleware = require('../middleware/rbac.middlewre');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Citizen routes
router.post(
  '/',
  authMiddleware,
  rbacMiddleware(['citizen']),
  upload.array('images', 5),
  createProblem
);

// Stats route (MUST be before /:id so 'stats' is not matched as an ObjectId)
router.get(
  '/stats/dashboard',
  authMiddleware,
  rbacMiddleware(['admin', 'citizen', 'university', 'industry']),
  getStats
);

// All authenticated users
router.get('/', authMiddleware, getProblems);
router.get('/:id', authMiddleware, getProblemById);

// Admin only
router.put('/:id/assign', authMiddleware, rbacMiddleware(['admin']), assignProblem);

module.exports = router;