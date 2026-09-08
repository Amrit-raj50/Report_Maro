// controllers/internal.controller.js
const Problem = require('../models/problem.model');
const Notification = require('../models/notification.model');

// 📝 PATCH /api/internal/problems/:id - AI updates problem
exports.updateProblemAI = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, priority, confidence, status } = req.body;

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
    if (priority) problem.priority = priority;
    if (confidence) problem.ai_confidence = confidence;

    // If status is 'verified', update and notify admin
    if (status === 'verified' && problem.status === 'submitted') {
      problem.status = 'verified';

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
        priority: problem.priority,
        confidence: problem.ai_confidence,
        status: problem.status,
      },
    });
  } catch (error) {
    next(error);
  }
};