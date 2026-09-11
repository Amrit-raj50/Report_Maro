const Problem = require('../models/problem.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');

/**
 * GET /api/government/dashboard-stats
 * Public endpoint for the Government Dashboard (no auth required for hackathon demo).
 * Aggregates data from Problems, Projects, and Users to power the 10 dashboard sections.
 */
const getGovernmentStats = async (req, res, next) => {
  try {
    // 1. KPI Overview (Section 1)
    const totalProblems = await Problem.countDocuments();
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const deployedProjects = await Project.countDocuments({ 
      status: 'completed', 
      industry_partner_id: { $ne: null } 
    });
    
    const totalUniversities = await User.countDocuments({ role: 'university' });
    const totalIndustry = await User.countDocuments({ role: 'industry' });
    
    const fundingAgg = await Project.aggregate([
      { $match: { budget: { $ne: null } } },
      { $group: { _id: null, total: { $sum: '$budget' } } }
    ]);
    const totalFunding = fundingAgg.length > 0 ? fundingAgg[0].total : 0;

    // 2. Domain Analytics (Section 2)
    const byCategory = await Problem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 3. District Hotspots (Section 3)
    const byDistrict = await Problem.aggregate([
      { $group: { _id: '$location.district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // 4. Pipeline Funnel (Section 4)
    const problemStatusCounts = await Problem.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const projectStatusCounts = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const pipeline = {
      problems: problemStatusCounts.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      projects: projectStatusCounts.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {})
    };

    // 5. University Stats (Section 5)
    const universityStats = await Project.aggregate([
      { $group: { 
          _id: '$university_id', 
          totalProjects: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          budget: { $sum: '$budget' }
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 
          universityId: '$_id', 
          name: '$user.full_name', 
          organization: '$user.organization',
          totalProjects: 1, 
          completed: 1, 
          budget: 1,
          _id: 0 
      }},
      { $limit: 10 }
    ]);

    // 6. Industry Stats (Section 6)
    const industryStats = await Project.aggregate([
      { $match: { industry_partner_id: { $ne: null } } },
      { $group: { 
          _id: '$industry_partner_id', 
          totalProjects: { $sum: 1 },
          totalFunding: { $sum: '$budget' }
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 
          industryId: '$_id', 
          name: '$user.full_name', 
          organization: '$user.organization',
          totalProjects: 1, 
          totalFunding: 1,
          _id: 0 
      }},
      { $sort: { totalFunding: -1 } },
      { $limit: 5 }
    ]);

    // 8. Projects Requiring Attention (Section 8)
    // For demo purposes, we flag projects that haven't been updated in 14 days
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const attentionProjectsRaw = await Project.find({ 
      status: { $ne: 'completed' },
      updated_at: { $lt: twoWeeksAgo }
    }).populate('problem_id', 'title').populate('university_id', 'full_name').limit(5);

    const attentionProjects = attentionProjectsRaw.map(p => ({
      projectId: p._id,
      problemTitle: p.problem_id?.title || 'Unknown',
      university: p.university_id?.full_name || 'Unknown',
      daysSinceUpdate: Math.floor((new Date() - p.updated_at) / (1000 * 60 * 60 * 24)),
      reason: 'No status update recently'
    }));

    // 9. Social Impact (Phase 6)
    const impactAgg = await Project.aggregate([
      { $group: {
          _id: null,
          totalPeopleImpacted: { $sum: { $ifNull: ['$people_impacted', 0] } },
          totalVillagesReached: { $sum: { $ifNull: ['$villages_reached', 0] } },
          totalPatents: { $sum: { $ifNull: ['$patents_filed', 0] } },
          totalStartups: { $sum: { $cond: ['$startup_created', 1, 0] } },
          totalDeployed: { $sum: { $cond: ['$deployed_to_field', 1, 0] } }
      }}
    ]);
    
    const impactStats = impactAgg.length > 0 ? impactAgg[0] : {
      totalPeopleImpacted: 0,
      totalVillagesReached: 0,
      totalPatents: 0,
      totalStartups: 0,
      totalDeployed: 0
    };

    res.json({
      success: true,
      data: {
        kpis: {
          totalProblems,
          totalProjects,
          completedProjects,
          deployedProjects,
          totalUniversities,
          totalIndustry,
          totalFunding
        },
        byCategory,
        byDistrict,
        pipeline,
        universityStats,
        industryStats,
        attentionProjects,
        impactStats,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/government/challenges
 * Public endpoint to list challenges for the government dashboard.
 */
const getGovernmentChallenges = async (req, res, next) => {
  try {
    const { category, district, status, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (district) query['location.district'] = district;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { _id: { $regex: search, $options: 'i' } } // Assuming ID search if valid, though regex on ObjectId might fail if not cast
      ];
      // Note: MongoDB regex on ObjectId will fail, so we just search title for simplicity in demo
      query.$or = [{ title: { $regex: search, $options: 'i' } }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const problems = await Problem.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Problem.countDocuments(query);
    const pages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: problems,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages
      }
    });
  } catch (error) {
    next(error);
  }
};

const exportCsv = async (req, res) => {
  try {
    const problems = await Problem.find().populate('submitted_by', 'full_name');
    
    let csv = 'ID,Title,Category,District,Status,Priority,Upvotes\n';
    problems.forEach(p => {
      const id = p._id.toString().substring(0, 8);
      const title = `"${(p.title || '').replace(/"/g, '""')}"`;
      const category = p.category || 'N/A';
      const district = p.location?.district || 'N/A';
      const status = p.status || 'N/A';
      const priority = p.priority || 'N/A';
      const upvotes = p.upvotes || 0;
      csv += `${id},${title},${category},${district},${status},${priority},${upvotes}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sih_state_data_export.csv"');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).send('Error generating CSV');
  }
};

module.exports = {
  getGovernmentStats,
  getGovernmentChallenges,
  exportCsv
};
