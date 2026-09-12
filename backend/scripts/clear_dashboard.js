const mongoose = require('mongoose');

const clearData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect('mongodb://sih:sih_dev_password@localhost:27017/sih_portal?authSource=admin');
    console.log("Connected! Dropping Users, Problems, and Projects...");

    await mongoose.connection.collection('users').deleteMany({});
    await mongoose.connection.collection('problems').deleteMany({});
    await mongoose.connection.collection('projects').deleteMany({});

    console.log("✅ Data successfully cleared! Your database is completely empty again.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing data:", error);
    process.exit(1);
  }
};

clearData();
