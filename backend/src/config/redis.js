const Redis = require('ioredis');

let redisClient = null;

function getRedisClient() {
  if (!redisClient) {
    const redisUri = process.env.REDIS_URI;
    if (!redisUri) {
      console.warn('⚠️ REDIS_URI environment variable is not set. Redis features will be disabled.');
      return null;
    }
    
    console.log('Connecting to Redis at:', redisUri.replace(/:[^@]*@/, ':****@')); // Hide password in logs

    const isUpstash = redisUri.includes('upstash.io') || redisUri.startsWith('rediss://');
    const options = {
      maxRetriesPerRequest: null,
      retryStrategy: (times) => {
        if (times > 3) {
          console.error('Redis retry exhausted, stopping.');
          return null;
        }
        return Math.min(times * 100, 3000);
      },
      lazyConnect: true,
    };

    if (isUpstash) {
      options.tls = { rejectUnauthorized: false };
    }

    try {
      redisClient = new Redis(redisUri, options);
    } catch (err) {
      console.error('❌ Failed to initialize Redis client:', err.message);
      return null;
    }

    redisClient.on('connect', () => {
      console.log('Redis connected successfully (singleton)');
    });

    redisClient.on('ready', () => {
      console.log('Redis is ready to accept commands');
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err.message);
      console.error('Full error:', err);
    });

    redisClient.on('close', () => {
      console.warn('Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis reconnecting...');
    });
  }
  return redisClient;
}

async function closeRedis() {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    console.log('Redis connection closed gracefully');
  }
}

module.exports = { getRedisClient, closeRedis };