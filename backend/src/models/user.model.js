const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password_hash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['citizen', 'admin', 'university', 'industry'],
      required: [true, 'Role is required'],
      default: 'citizen',
    },
    organization: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    district: {
      type: String,
      trim: true,
      default: null,
    },
    taluka: {
      type: String,
      trim: true,
      default: null,
    },
    village_or_city: {
      type: String,
      trim: true,
      default: null,
    },
    pincode: {
      type: String,
      trim: true,
      default: null,
    },
    lgd_district_code: {
      type: Number,
      default: null,
    },
    lgd_block_code: {
      type: Number,
      default: null,
    },
    university_profile: {
      departments: { type: [String], default: [] },
      research_areas: { type: [String], default: [] },
      technical_capabilities: { type: [String], default: [] },
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Indexes for faster queries
// UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

module.exports = mongoose.model('User', UserSchema);