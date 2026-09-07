const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'timestamp',
      updatedAt: false,
    },
  }
);

AuditLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AuditLog', AuditLogSchema);