const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { getRedisClient, closeRedis } = require('./config/redis');

dotenv.config();

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('MongoDB connected successfully!');

    // Initialize Redis
    const redis = getRedisClient();
    
    // Wait for Redis to be ready
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Redis connection timeout after 10s'));
      }, 10000);
      
      redis.once('ready', () => {
        clearTimeout(timeout);
        resolve();
      });
      
      redis.once('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    console.log('Redis is ready!');

    const server = app.listen(3000, () => {
      console.log('Server is running on port 3000');
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
    console.error('Failed to start server:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();