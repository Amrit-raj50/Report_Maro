// src/queue/worker.js
const { Worker } = require('bullmq');
const axios = require('axios');
const { getRedisClient } = require('../config/redis');

// Get Redis connection
const redis = getRedisClient();

/**
 * 🧠 Dummy AI Classification (Replace with real AI model later)
 */
const classifyText = (text) => {
  const words = text.toLowerCase().split(' ');

  const categories = {
    water: ['water', 'pond', 'river', 'drinking', 'flood', 'irrigation', 'drainage'],
    road: ['road', 'pothole', 'bridge', 'construction', 'drain', 'street'],
    health: ['hospital', 'doctor', 'medicine', 'disease', 'health', 'clinic'],
    other: [],
  };

  let bestCategory = 'other';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(categories)) {
    const score = keywords.filter((k) => words.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
};

/**
 * Get priority based on urgency keywords
 */
const getPriority = (text) => {
  const urgentWords = ['emergency', 'critical', 'urgent', 'death', 'accident', 'flood'];
  const words = text.toLowerCase().split(' ');
  return urgentWords.some((w) => words.includes(w)) ? 'high' : 'medium';
};

// Create the worker
const worker = new Worker(
  'classification-queue',
  async (job) => {
    const { problemId, text } = job.data;
    console.log(`🧠 [Worker] Processing job for problem: ${problemId}`);

    // 1. Run AI classification (dummy logic)
    const category = classifyText(text);
    const priority = getPriority(text);
    const confidence = 0.85;

    console.log(`📊 [Worker] Result: Category=${category}, Priority=${priority}`);

    // 2. Send result to Backend via Internal API
    try {
      const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3000';
      await axios.patch(
        `${internalApiUrl}/api/internal/problems/${problemId}`,
        {
          category,
          priority,
          confidence,
          status: 'verified',
        },
        {
          headers: {
            'x-internal-api-key': process.env.INTERNAL_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`✅ [Worker] Problem ${problemId} updated successfully`);
      return { success: true, category, priority };
    } catch (error) {
      console.error(`❌ [Worker] Failed to update problem ${problemId}:`, error.message);
      throw error; // BullMQ will retry
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  console.log(`✅ [Worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ [Worker] Job ${job.id} failed: ${err.message}`);
});

console.log('🚀 AI Worker started! Waiting for jobs...');

module.exports = worker;