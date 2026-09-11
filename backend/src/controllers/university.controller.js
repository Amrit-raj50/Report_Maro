// controllers/university.controller.js
// Provides official Jharkhand universities and constituent/affiliated colleges
const University = require('../models/university.model');

// 📝 GET /api/universities - Query official Jharkhand institutions
const getUniversities = async (req, res, next) => {
  try {
    const { district, category, parent_university, search } = req.query;
    const filter = {};

    if (district) {
      filter.district = new RegExp(`^${district.trim()}$`, 'i');
    }
    if (category) {
      filter.category = category;
    }
    if (parent_university) {
      filter.parent_university = new RegExp(parent_university.trim(), 'i');
    }
    if (search) {
      const s = search.trim();
      filter.$or = [
        { name: new RegExp(s, 'i') },
        { short_name: new RegExp(s, 'i') },
        { college_name: new RegExp(s, 'i') },
        { district: new RegExp(s, 'i') },
        { city: new RegExp(s, 'i') },
        { code: new RegExp(s, 'i') },
      ];
    }

    const universities = await University.find(filter).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: universities.length,
      data: universities,
    });
  } catch (error) {
    next(error);
  }
};

// 📝 GET /api/universities/:identifier - Fetch specific university by code or id
const getUniversityByIdentifier = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let university = await University.findOne({ code: identifier });
    if (!university && identifier.match(/^[0-9a-fA-F]{24}$/)) {
      university = await University.findById(identifier);
    }
    if (!university) {
      university = await University.findOne({ name: new RegExp(`^${identifier.trim()}$`, 'i') });
    }

    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      });
    }

    res.json({
      success: true,
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

// 📝 PUT/POST /api/universities/:identifier/departments - Save departments directly to MongoDB
const saveDepartments = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let { departments, department, action } = req.body;

    let deptList = [];
    if (Array.isArray(departments)) {
      deptList = departments;
    } else if (typeof departments === 'string') {
      deptList = departments.split(',').map((d) => d.trim()).filter(Boolean);
    } else if (typeof department === 'string') {
      deptList = [department.trim()];
    }

    // Clean and unique department strings
    deptList = Array.from(
      new Set(
        deptList
          .map((d) => (typeof d === 'string' ? d.trim() : ''))
          .filter((d) => d.length > 0)
      )
    );

    let university = await University.findOne({
      $or: [
        { code: identifier },
        { aishe_code: identifier },
        ...(identifier.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: identifier }] : []),
        { name: new RegExp(`^${identifier.trim()}$`, 'i') },
        { short_name: new RegExp(`^${identifier.trim()}$`, 'i') },
      ],
    });

    if (!university && (req.body.name || req.body.university_name)) {
      const candidateName = (req.body.name || req.body.university_name).trim();
      university = await University.findOne({
        name: new RegExp(`^${candidateName}$`, 'i'),
      });
    }

    if (!university) {
      const institutionName = (req.body.name || req.body.university_name || identifier).trim();
      if (institutionName && institutionName !== '__other__') {
        const generatedCode =
          identifier !== '__other__'
            ? identifier
            : institutionName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 50);

        university = await University.create({
          code: generatedCode,
          name: institutionName,
          short_name: req.body.short_name || institutionName,
          category: req.body.category || 'Affiliated Colleges',
          parent_university: req.body.parent_university || institutionName,
          district: req.body.district || 'Ranchi',
          departments: deptList,
        });

        return res.status(201).json({
          success: true,
          message: `Institution created and saved ${deptList.length} department(s) to MongoDB Atlas!`,
          data: university,
        });
      }

      return res.status(404).json({
        success: false,
        message: `Institution '${identifier}' not found in database`,
      });
    }

    if (action === 'append' || action === 'add') {
      const existing = university.departments || [];
      university.departments = Array.from(new Set([...existing, ...deptList]));
    } else {
      university.departments = deptList;
    }

    await university.save();

    res.json({
      success: true,
      message: `Successfully saved ${university.departments.length} department(s) to MongoDB!`,
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

// 📝 POST /api/universities - Register a new university or college node directly into MongoDB
const createUniversity = async (req, res, next) => {
  try {
    const {
      name,
      short_name,
      category,
      parent_university,
      district,
      city,
      pincode,
      aishe_code,
      departments,
    } = req.body;

    if (!name || !district) {
      return res.status(400).json({
        success: false,
        message: 'Institution name and district are required',
      });
    }

    const code =
      req.body.code ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 50);

    const deptList = Array.isArray(departments)
      ? Array.from(new Set(departments.map((d) => d.trim()).filter(Boolean)))
      : [];

    const university = await University.findOneAndUpdate(
      { code },
      {
        $set: {
          code,
          name,
          short_name: short_name || name,
          category: category || 'Affiliated Colleges',
          parent_university: parent_university || name,
          district,
          city: city || district,
          pincode: pincode || null,
          aishe_code: aishe_code || null,
          departments: deptList,
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Institution registered and saved to MongoDB successfully',
      data: university,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUniversities,
  getUniversityByIdentifier,
  saveDepartments,
  createUniversity,
};
