// src/queue/producer.js
const { Queue } = require('bullmq');
const { getRedisClient } = require('../config/redis');

// Get Redis connection
const redis = getRedisClient();

// Create a BullMQ queue for classification jobs
const classificationQueue = new Queue('classification-queue', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3, // Retry 3 times if fails
    backoff: {
      type: 'exponential', // Wait longer each retry
      delay: 1000, // Start with 1 second
    },
    removeOnComplete: true, // Auto-cleanup after success
    removeOnFail: false, // Keep failed jobs for debugging
  },
});

/**
 * Add a job to the queue for AI processing
 * @param {string} problemId - The ID of the problem
 * @param {string} text - The problem description text
 */
const enqueueClassification = async (problemId, text) => {
  await classificationQueue.add('classify', { problemId, text });
  console.log(`📤 [Queue] Job added for problem: ${problemId}`);
};

module.exports = { classificationQueue, enqueueClassification };