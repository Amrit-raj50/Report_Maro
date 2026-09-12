const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true,
      index: true,
    },
    short_name: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Central University',
        'State University',
        'Deemed University-Private',
        'Govt Engineering',
        'Constituent Colleges',
        'Affiliated Colleges',
        'Institute of National Importance',
      ],
      required: true,
    },
    parent_university: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    college_name: {
      type: String,
      trim: true,
      default: null,
    },
    district: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    pincode: {
      type: String,
      trim: true,
      default: null,
    },
    aishe_code: {
      type: String,
      trim: true,
      default: null,
    },
    website: {
      type: String,
      trim: true,
      default: null,
    },
    official_source: {
      type: String,
      trim: true,
      default: 'https://www.jharkhand.gov.in/PDirectorate/UniversityDetailList',
    },
    departments: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

module.exports = mongoose.model('University', UniversitySchema);
