require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const connectDB = require('../config/db');

const universities = [
  {
    full_name: 'IIT (ISM) Dhanbad',
    email: 'admin@iitism.ac.in',
    password: 'password123',
    role: 'university',
    organization: 'Indian Institute of Technology (Indian School of Mines), Dhanbad',
    district: 'Dhanbad',
    university_profile: {
      departments: ['Mining Engineering', 'Petroleum Engineering', 'Environmental Science and Engineering', 'Civil Engineering'],
      research_areas: ['Groundwater Contamination', 'Mine Water Management', 'Clean Energy', 'Geotechnical Engineering'],
      technical_capabilities: ['Advanced Mining Labs', 'Environmental Monitoring', 'Geospatial Analysis']
    }
  },
  {
    full_name: 'BIT Mesra',
    email: 'admin@bitmesra.ac.in',
    password: 'password123',
    role: 'university',
    organization: 'Birla Institute of Technology, Mesra',
    district: 'Ranchi',
    university_profile: {
      departments: ['Civil & Environmental Engineering', 'Remote Sensing', 'Architecture', 'Water Engineering'],
      research_areas: ['Water Quality Assessment', 'Smart City Development', 'Sustainable Urban Drainage', 'Waste to Energy'],
      technical_capabilities: ['GIS Mapping', 'Environmental Testing Labs', 'Remote Sensing Imagery Analysis']
    }
  },
  {
    full_name: 'NIT Jamshedpur',
    email: 'admin@nitjsr.ac.in',
    password: 'password123',
    role: 'university',
    organization: 'National Institute of Technology Jamshedpur',
    district: 'Purbi Singhbhum',
    university_profile: {
      departments: ['Civil Engineering', 'Mechanical Engineering', 'Metallurgical and Materials Engineering'],
      research_areas: ['Highway Maintenance', 'Bridge Design', 'Hydrology', 'Pothole Material Science', 'Traffic Management'],
      technical_capabilities: ['Asphalt Testing Lab', 'Structural Integrity Testing', 'Traffic Flow Simulation']
    }
  },
  {
    full_name: 'RIMS Ranchi',
    email: 'admin@rimsranchi.ac.in',
    password: 'password123',
    role: 'university',
    organization: 'Rajendra Institute of Medical Sciences (RIMS)',
    district: 'Ranchi',
    university_profile: {
      departments: ['Public Health', 'Community Medicine', 'Microbiology', 'Sanitation and Hygiene'],
      research_areas: ['Epidemiology', 'Vector-borne Diseases', 'Medical Waste Management', 'Drinking Water Pathogens'],
      technical_capabilities: ['Disease Outbreak Tracking', 'Public Health Labs', 'Microbiological Contamination Analysis']
    }
  },
  {
    full_name: 'Birsa Agricultural University',
    email: 'admin@bauranchi.ac.in',
    password: 'password123',
    role: 'university',
    organization: 'Birsa Agricultural University (BAU)',
    district: 'Ranchi',
    university_profile: {
      departments: ['Agricultural Engineering', 'Forestry', 'Veterinary Science', 'Soil Science'],
      research_areas: ['Irrigation Systems', 'Soil Conservation', 'Animal Health', 'Crop Science'],
      technical_capabilities: ['Soil Testing Labs', 'Irrigation Optimization Models', 'Veterinary Disease Diagnosis']
    }
  },
  {
    full_name: 'CUJ',
    email: 'admin@cuj.ac.in',
    password: 'password123',
    role: 'university',
    organization: 'Central University of Jharkhand',
    district: 'Ranchi',
    university_profile: {
      departments: ['Energy Engineering', 'Water Engineering and Management', 'Transport Science and Technology', 'Geoinformatics'],
      research_areas: ['Renewable Energy Systems', 'Urban Transportation', 'River Basin Management', 'Traffic Congestion Solutions'],
      technical_capabilities: ['Spatial Analysis Lab', 'Energy Auditing', 'Water Testing Lab']
    }
  }
];

const seedUniversities = async () => {
  try {
    await connectDB();
    console.log('📦 Connected to MongoDB for Seeding');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const uni of universities) {
      const existingUni = await User.findOne({ email: uni.email });
      if (existingUni) {
        existingUni.university_profile = uni.university_profile;
        existingUni.organization = uni.organization;
        existingUni.district = uni.district;
        await existingUni.save();
        console.log(`✅ Updated existing university profile for ${uni.organization}`);
        updatedCount++;
      } else {
        await User.create({
          ...uni,
          password_hash: hashedPassword
        });
        console.log(`✅ Created new university: ${uni.organization}`);
        insertedCount++;
      }
    }

    console.log(`\n🎉 Seeding Complete: ${insertedCount} inserted, ${updatedCount} updated.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedUniversities();
