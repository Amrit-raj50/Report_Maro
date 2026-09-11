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
  upvotes: Number, created_at: Date
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

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const DOMAINS = ['water', 'road', 'health', 'education', 'agriculture', 'electricity', 'sanitation', 'other'];
const DISTRICTS = ['Ranchi', 'Dhanbad', 'Bokaro', 'East Singhbhum', 'Hazaribagh', 'Giridih', 'Palamu', 'Deoghar', 'Garhwa', 'Dumka'];

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect('mongodb://sih:sih_dev_password@localhost:27017/sih_portal?authSource=admin');
    console.log("Connected! Clearing old data...");

    await User.deleteMany({});
    await Problem.deleteMany({});
    await Project.deleteMany({});

    console.log("Inserting Universities and Industry Partners...");
    const universities = await User.insertMany([
      { full_name: "BIT Mesra", email: "contact@bitmesra.ac.in", role: "university" },
      { full_name: "NIT Jamshedpur", email: "admin@nitjsr.ac.in", role: "university" },
      { full_name: "IIT (ISM) Dhanbad", email: "admin@iitism.ac.in", role: "university" },
      { full_name: "Ranchi University", email: "info@ranchiuniversity.ac.in", role: "university" },
      { full_name: "Vinoba Bhave University", email: "vbu@vbu.ac.in", role: "university" }
    ]);

    const industries = await User.insertMany([
      { full_name: "Tata Steel", email: "csr@tatasteel.com", role: "industry" },
      { full_name: "Central Coalfields", email: "innovate@ccl.in", role: "industry" },
      { full_name: "Bokaro Steel Plant", email: "csr@sail.co.in", role: "industry" },
      { full_name: "Uranium Corp India", email: "ucil@ucil.gov.in", role: "industry" }
    ]);

    console.log("Generating 120 Problems across Jharkhand...");
    const problems = [];
    const statuses = ['submitted', 'verified', 'assigned'];
    
    for (let i = 0; i < 120; i++) {
      const isAssigned = Math.random() > 0.4;
      const status = isAssigned ? 'assigned' : statuses[getRandomInt(0, 1)];
      const district = DISTRICTS[getRandomInt(0, DISTRICTS.length - 1)];
      const category = DOMAINS[getRandomInt(0, DOMAINS.length - 1)];
      const title = `Issue with ${category} infrastructure in ${district} Sector ${getRandomInt(1, 10)}`;
      
      problems.push({
        title, 
        category: ['water', 'road', 'health', 'other'].includes(category) ? category : 'other', 
        status, 
        priority: Math.random() > 0.8 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low', 
        location: { district },
        upvotes: getRandomInt(0, 150),
        created_at: getRandomDate(new Date(2025, 0, 1), new Date())
      });
    }
    const insertedProblems = await Problem.insertMany(problems);

    console.log("Generating 75 Projects for assigned problems...");
    const projects = [];
    const assignedProblems = insertedProblems.filter(p => p.status === 'assigned');
    
    for (let i = 0; i < assignedProblems.length; i++) {
      const p = assignedProblems[i];
      const isCompleted = Math.random() > 0.6; // 40% completed
      const hasIndustry = Math.random() > 0.5; // 50% funded
      const startDate = getRandomDate(new Date(2025, 0, 1), new Date());
      const needsAttention = Math.random() > 0.8; // 20% stalled
      const updatedAt = needsAttention ? new Date(Date.now() - 1000 * 60 * 60 * 24 * getRandomInt(15, 30)) : new Date();

      projects.push({
        problem_id: p._id,
        university_id: universities[getRandomInt(0, universities.length - 1)]._id,
        industry_partner_id: hasIndustry ? industries[getRandomInt(0, industries.length - 1)]._id : null,
        status: isCompleted ? 'completed' : 'active',
        budget: hasIndustry ? getRandomInt(100000, 5000000) : getRandomInt(10000, 100000),
        people_impacted: isCompleted ? getRandomInt(500, 25000) : 0,
        villages_reached: isCompleted ? getRandomInt(1, 20) : 0,
        patents_filed: isCompleted && Math.random() > 0.8 ? getRandomInt(1, 3) : 0,
        startup_created: isCompleted && Math.random() > 0.9,
        deployed_to_field: isCompleted,
        created_at: startDate,
        updated_at: updatedAt
      });
    }
    await Project.insertMany(projects);

    console.log("✅ MONA LISA Seed completed! 120 Problems, 75 Projects inserted.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
