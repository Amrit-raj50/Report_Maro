// src/queue/producer.js
const { Queue } = require('bullmq');
const { getRedisClient } = require('../config/redis');

// Lazy init — Queue is created on first use, not at require() time.
// This avoids calling getRedisClient() before dotenv has loaded REDIS_URI.
let classificationQueue = null;

function getQueue() {
  if (!classificationQueue) {
    const client = getRedisClient();
    if (!client) {
      return null;
    }
    try {
      classificationQueue = new Queue('classification-queue', {
        connection: client,
        defaultJobOptions: {
          attempts: 3, // Retry 3 times if fails
          backoff: {
            type: 'exponential', // Wait longer each retry
            delay: 1000,         // Start with 1 second
          },
          removeOnComplete: true, // Auto-cleanup after success
          removeOnFail: false,    // Keep failed jobs for debugging
        },
      });
    } catch (err) {
      console.warn('⚠️ [Queue] Could not create BullMQ queue:', err.message);
      return null;
    }
  }
  return classificationQueue;
}

/**
 * Add a job to the queue for AI processing
 * @param {string} problemId - The ID of the problem
 * @param {string} text - The problem description text
 */
const enqueueClassification = async (problemId, text) => {
  try {
    const q = getQueue();
    if (!q) {
      console.warn(`⚠️ [Queue] Redis queue unavailable; skipping AI job for problem ${problemId}`);
      return;
    }
    await q.add('classify', { problemId, text });
    console.log(`📤 [Queue] Job added for problem: ${problemId}`);
  } catch (err) {
    console.warn(`⚠️ [Queue] Could not enqueue classification for ${problemId}:`, err.message);
  }
};

module.exports = { getQueue, enqueueClassification };