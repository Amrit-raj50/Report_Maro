// src/index.js
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { getRedisClient, closeRedis } = require('./config/redis');

const startServer = async () => {
  try {
    // 1. Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected successfully!');

    // 2. Initialize Redis (no need to wait for "ready")
    const redis = getRedisClient();
    console.log('✅ Redis initialized');

    // 3. Start the server IMMEDIATELY
    const server = app.listen(3000, () => {
      console.log('🚀 Server is running on http://localhost:3000');
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`Received ${signal}, closing gracefully...`);
      await closeRedis();
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();