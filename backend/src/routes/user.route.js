// routes/user.route.js
//
// Additive route — see controllers/user.controller.js for why this exists.
const express = require('express');
const { getUsers } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Any authenticated user can look up organizations by role (e.g. an admin
// picking a university to assign a problem to, or a citizen browsing
// partner universities/industries). No PII beyond what /auth/me already
// exposes is returned — password_hash is always excluded.
router.get('/', authMiddleware, getUsers);

module.exports = router;
