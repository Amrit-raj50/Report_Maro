// routes/university.route.js
const express = require('express');
const {
  getUniversities,
  getUniversityByIdentifier,
  saveDepartments,
  createUniversity,
} = require('../controllers/university.controller');

const router = express.Router();

// GET /api/universities - List and search all official Jharkhand universities and colleges
router.get('/', getUniversities);

// POST /api/universities - Register a new university or college node directly into MongoDB
router.post('/', createUniversity);

// GET /api/universities/:identifier - Get institution by code, name, or ID
router.get('/:identifier', getUniversityByIdentifier);

// PUT/POST /api/universities/:identifier/departments - Directly save/update departments in MongoDB
router.put('/:identifier/departments', saveDepartments);
router.post('/:identifier/departments', saveDepartments);

module.exports = router;
