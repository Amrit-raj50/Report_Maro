// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const University = require('../models/university.model');

// 📝 REGISTER - Create a new user
const register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      role,
      organization,
      phone,
      district,
      taluka,
      village_or_city,
      pincode,
      lgd_district_code,
      lgd_block_code,
      departments,
      university_code,
    } = req.body;

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login.',
      });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Create user
    const user = await User.create({
      full_name,
      email,
      password_hash,
      role: role || 'citizen', // default citizen
      organization: organization || null,
      phone: phone || null,
      district: district || null,
      taluka: taluka || null,
      village_or_city: village_or_city || null,
      pincode: pincode || null,
      lgd_district_code: lgd_district_code || null,
      lgd_block_code: lgd_block_code || null,
    });

    // 3.1 If registering university with departments, persist departments directly to MongoDB
    if (role === 'university' && (departments || university_code)) {
      const codeOrName = university_code || organization;
      const deptList = Array.isArray(departments)
        ? departments.map((d) => String(d).trim()).filter(Boolean)
        : typeof departments === 'string'
          ? departments.split(',').map((d) => d.trim()).filter(Boolean)
          : [];

      if (codeOrName && deptList.length > 0) {
        await University.findOneAndUpdate(
          { $or: [{ code: codeOrName }, { name: new RegExp(`^${codeOrName}$`, 'i') }] },
          { $addToSet: { departments: { $each: deptList } } }
        ).catch(() => null);
      }
    }

    // 4. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 5. Send response (exclude password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        phone: user.phone,
        district: user.district,
        taluka: user.taluka,
        village_or_city: user.village_or_city,
        pincode: user.pincode,
        lgd_district_code: user.lgd_district_code,
        lgd_block_code: user.lgd_block_code,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 📝 LOGIN - Authenticate user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // 4. Send response
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        phone: user.phone,
        district: user.district,
        taluka: user.taluka,
        village_or_city: user.village_or_city,
        pincode: user.pincode,
        lgd_district_code: user.lgd_district_code,
        lgd_block_code: user.lgd_block_code,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// 📝 GET ME - Get current logged-in user's data
const getMe = async (req, res) => {
  try {
    // `req.user` is set by the auth middleware
    const user = await User.findById(req.user.id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
};