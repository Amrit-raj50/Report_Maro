// controllers/project.controller.js
const Project = require('../models/project.model');
const Problem = require('../models/problem.model');
const Notification = require('../models/notification.model');

// 📝 POST /api/projects/:id/proposal - University submits proposal
exports.submitProposal = async (req, res, next) => {
  try {
    const { proposal_text, budget, milestones } = req.body;
    const projectId = req.params.id;

    if (!proposal_text || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Proposal text and budget are required',
      });
    }

    // Find project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify ownership
    if (project.university_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to submit proposal for this project',
      });
    }

    // Verify status
    if (project.status !== 'proposed') {
      return res.status(409).json({
        success: false,
        message: `Project is already ${project.status}. Cannot submit proposal.`,
      });
    }

    // Update project
    project.proposal_text = proposal_text;
    project.budget = budget;
    project.milestones = milestones || [];
    project.status = 'under_review';
    await project.save();

    // Notify industry partners
    await Notification.create({
      userId: null, // Broadcast to industry
      message: `New proposal submitted for problem`,
      type: 'funding',
      link: `/projects/${project._id}`,
    });

    // Emit Socket event
    const io = req.app.get('io');
    if (io) {
      io.to('industry').emit('new_proposal', {
        projectId: project._id,
        problemId: project.problem_id,
        budget: project.budget,
      });
    }

    res.json({
      success: true,
      message: 'Proposal submitted successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// 📝 PUT /api/projects/:id/fund - Industry funds project
exports.fundProject = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const projectId = req.params.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid funding amount is required',
      });
    }

    // Find project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify status
    if (project.status !== 'under_review' && project.status !== 'proposed') {
      return res.status(409).json({
        success: false,
        message: `Project is ${project.status}. Cannot fund now.`,
      });
    }

    // Update project
    project.status = 'active';
    project.budget = amount;
    project.industry_partner_id = req.user.id;
    await project.save();

    // Update problem status
    await Problem.findByIdAndUpdate(project.problem_id, {
      status: 'in_progress',
    });

    // Notify university
    await Notification.create({
      userId: project.university_id,
      message: 'Your project has been funded! Start working on the solution.',
      type: 'funding',
      link: `/projects/${project._id}`,
    });

    // Notify admin
    await Notification.create({
      userId: null,
      message: `Project funded: Amount ₹${amount}`,
      type: 'status_update',
      link: `/projects/${project._id}`,
    });

    // Emit Socket events
    const io = req.app.get('io');
    if (io) {
      io.to(`university_${project.university_id}`).emit('project_funded', {
        projectId: project._id,
        amount: amount,
      });
      io.to('admins').emit('project_active', {
        projectId: project._id,
        amount: amount,
      });
    }

    res.json({
      success: true,
      message: 'Project funded successfully!',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};