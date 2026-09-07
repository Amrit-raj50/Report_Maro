const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    problem_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      unique: true, // ✅ One project per problem
    },
    university_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    industry_partner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    proposal_text: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['proposed', 'under_review', 'active', 'completed'],
      default: 'proposed',
    },
    budget: {
      type: Number,
      min: 0,
      default: null,
    },
    milestones: {
      type: [
        {
          title: { type: String, required: true },
          dueDate: { type: Date, required: true },
          done: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Indexes
ProjectSchema.index({ problem_id: 1 });
ProjectSchema.index({ university_id: 1 });
ProjectSchema.index({ status: 1 });

module.exports = mongoose.model('Project', ProjectSchema);