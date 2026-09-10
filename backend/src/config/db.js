const mongoose = require('mongoose');
const dns = require('dns');

// Ensure MongoDB Atlas SRV lookup succeeds across local ISP/Windows DNS configurations
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (_) {
  // Continue with default resolver if unable to set servers
}

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongoDB connected successfully!");
    }catch(error){
        console.log("mongoDB connection failed.",error.message);
        process.exit(1);
    }
}

module.exports = connectDB;