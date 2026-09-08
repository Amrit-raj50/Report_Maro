// utils/redisCache.js
const { getRedisClient } = require('../config/redis');

// Get cached data
exports.getCache = async (key) => {
  try {
    const redis = getRedisClient();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// Set cached data with TTL (seconds)
exports.setCache = async (key, data, ttl = 300) => {
  try {
    const redis = getRedisClient();
    if (!data) {
      // Delete if data is null
      await redis.del(key);
      return;
    }
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

// Delete cache key
exports.clearCache = async (key) => {
  try {
    const redis = getRedisClient();
    await redis.del(key);
  } catch (error) {
    console.error('Cache clear error:', error);
  }
};