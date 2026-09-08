// controllers/user.controller.js
//
// Added alongside apps/web (the new frontend) because nothing in the existing
// auth/problem/project controllers lets an admin discover which users to
// assign a verified problem to, or lets a citizen browse partner
// organizations. This is additive only — no existing controller is changed.
const User = require('../models/user.model');

// 📝 GET /api/users?role=university - List users, optionally filtered by role
exports.getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter).select('-password_hash');

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
