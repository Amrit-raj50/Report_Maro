// controllers/internal.controller.js
const Problem = require('../models/problem.model');
const Notification = require('../models/notification.model');
const AuditLog = require('../models/auditlog.model');

// 📝 PATCH /api/internal/problems/:id - AI updates problem
const updateProblemAI = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      category,
      sub_category,
      priority,
      confidence,
      ai_reasoning,
      required_expertise,
      duplicate_check,
      recommended_universities,
      status,
    } = req.body;

    console.log(`🔑 [Internal] Updating problem ${id}`);

    // Find problem
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found',
      });
    }

    // Update AI fields
    if (category) problem.category = category;
    if (sub_category !== undefined) problem.sub_category = sub_category;
    if (priority) problem.priority = priority;
    if (confidence !== undefined) problem.ai_confidence = confidence;
    if (ai_reasoning !== undefined) problem.ai_reasoning = ai_reasoning;
    if (required_expertise !== undefined) problem.required_expertise = required_expertise;
    if (duplicate_check !== undefined) problem.duplicate_check = duplicate_check;
    if (recommended_universities !== undefined) problem.recommended_universities = recommended_universities;

    // If status is 'verified', update and notify admin
    if (status === 'verified' && problem.status === 'submitted') {
      problem.status = 'verified';

      // Audit log
      await AuditLog.create({
        eventType: 'PROBLEM_AI_VERIFIED',
        payload: {
          problemId: problem._id,
          category,
          sub_category,
          priority,
          confidence,
          ai_reasoning,
          required_expertise,
          duplicate_check,
          recommended_universities,
        },
        source: 'ai_worker',
      }).catch(err => console.error('AuditLog error:', err.message));

      // Create notification
      await Notification.create({
        userId: null, // Broadcast to admins
        message: `🔍 Problem "${problem.title}" verified by AI`,
        type: 'status_update',
        link: `/problems/${problem._id}`,
      });

      // Emit Socket event
      const io = req.app.get('io');
      if (io) {
        io.to('admins').emit('problem_verified', {
          problemId: problem._id,
          title: problem.title,
          category: problem.category,
          sub_category: problem.sub_category,
          priority: problem.priority,
        });
      }

      console.log(`📢 [Internal] Problem ${id} verified, admin notified`);
    }

    await problem.save();

    res.json({
      success: true,
      message: 'Problem updated successfully',
      data: {
        category: problem.category,
        sub_category: problem.sub_category,
        priority: problem.priority,
        confidence: problem.ai_confidence,
        ai_reasoning: problem.ai_reasoning,
        required_expertise: problem.required_expertise,
        duplicate_check: problem.duplicate_check,
        recommended_universities: problem.recommended_universities,
        status: problem.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProblemAI,
};