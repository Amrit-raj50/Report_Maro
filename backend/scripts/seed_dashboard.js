const mongoose = require('mongoose');

// Mongoose Models
const UserSchema = new mongoose.Schema({
  full_name: String, email: String, role: String,
  organization: String, district: String
});
const User = mongoose.model('User', UserSchema);

const ProblemSchema = new mongoose.Schema({
  title: String, description: String, category: String,
  status: String, priority: String,
  location: { district: String, address: String, coordinates: { lat: Number, lng: Number } },
  reported_by: mongoose.Schema.Types.ObjectId,
  upvotes: Number
});
const Problem = mongoose.model('Problem', ProblemSchema);

const ProjectSchema = new mongoose.Schema({
  problem_id: mongoose.Schema.Types.ObjectId,
  university_id: mongoose.Schema.Types.ObjectId,
  industry_partner_id: mongoose.Schema.Types.ObjectId,
  status: String, budget: Number,
  people_impacted: Number, villages_reached: Number,
  patents_filed: Number, startup_created: Boolean,
  deployed_to_field: Boolean,
  updated_at: Date, created_at: Date
});
const Project = mongoose.model('Project', ProjectSchema);

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect('mongodb://sih:sih_dev_password@localhost:27017/sih_portal?authSource=admin');
    console.log("Connected! Clearing old demo data...");

    // Clear everything so we have a clean slate for the demo
    await User.deleteMany({});
    await Problem.deleteMany({});
    await Project.deleteMany({});

    console.log("Inserting Universities and Industry Partners...");
    const bitMesra = await User.create({ full_name: "BIT Mesra", email: "contact@bitmesra.ac.in", role: "university" });
    const nitJsr = await User.create({ full_name: "NIT Jamshedpur", email: "admin@nitjsr.ac.in", role: "university" });
    const tataSteel = await User.create({ full_name: "Tata Steel", email: "csr@tatasteel.com", role: "industry" });
    const ccl = await User.create({ full_name: "Central Coalfields", email: "innovate@ccl.in", role: "industry" });

    console.log("Inserting Problems...");
    const problems = [];
    
    // Water (Ranchi)
    problems.push(await Problem.create({
      title: "Arsenic contamination in groundwater", category: "water", status: "assigned", priority: "high", location: { district: "Ranchi" }
    }));
    // Road (Dhanbad)
    problems.push(await Problem.create({
      title: "Potholes causing accidents on NH", category: "road", status: "assigned", priority: "high", location: { district: "Dhanbad" }
    }));
    // Health (Bokaro)
    problems.push(await Problem.create({
      title: "Lack of maternal care facilities", category: "health", status: "assigned", priority: "medium", location: { district: "Bokaro" }
    }));
    // Just submitted (no project yet)
    problems.push(await Problem.create({
      title: "Traffic congestion at Albert Ekka Chowk", category: "road", status: "submitted", priority: "low", location: { district: "Ranchi" }
    }));
    problems.push(await Problem.create({
      title: "Water scarcity in summer", category: "water", status: "verified", priority: "medium", location: { district: "Deoghar" }
    }));

    console.log("Inserting Projects...");
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 20); // 20 days ago to trigger "Attention" flag

    // Completed project with massive impact
    await Project.create({
      problem_id: problems[0]._id, university_id: bitMesra._id, industry_partner_id: tataSteel._id,
      status: "completed", budget: 1500000, people_impacted: 12500, villages_reached: 14,
      patents_filed: 2, startup_created: true, deployed_to_field: true,
      updated_at: new Date(), created_at: new Date()
    });

    // Active project (needs attention)
    await Project.create({
      problem_id: problems[1]._id, university_id: nitJsr._id, industry_partner_id: ccl._id,
      status: "active", budget: 800000, people_impacted: 0, villages_reached: 0,
      updated_at: twoWeeksAgo, created_at: twoWeeksAgo
    });

    // Active project (healthy)
    await Project.create({
      problem_id: problems[2]._id, university_id: bitMesra._id,
      status: "active", budget: 350000, people_impacted: 500, villages_reached: 2,
      updated_at: new Date(), created_at: new Date()
    });

    console.log("✅ Data successfully seeded! Refresh your Government Dashboard.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
