// src/queue/worker.js
const { Worker } = require('bullmq');
const axios = require('axios');
const { OpenAI } = require('openai');
const { getRedisClient } = require('../config/redis');

// Get Redis connection
const redis = getRedisClient();

/**
 * ⚡ NVIDIA NIM AI Client Setup
 * Uses OpenAI-compatible client endpoint: https://integrate.api.nvidia.com/v1
 */
const getNvidiaClient = () => {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ [AI Worker] NVIDIA_API_KEY is not set in environment. Falling back to rule-based fallback.');
    return null;
  }
  return new OpenAI({
    apiKey,
    baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
  });
};

/**
 * Fallback classification function (rule-based)
 */
const fallbackClassify = (text) => {
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

  const urgentWords = ['emergency', 'critical', 'urgent', 'death', 'accident', 'flood'];
  const priority = urgentWords.some((w) => words.includes(w)) ? 'high' : 'medium';

  return {
    category: bestCategory,
    priority,
    confidence: 0.70,
  };
};

/**
 * 🧠 NVIDIA Build Model Inference Call
 */
const analyzeProblemWithAI = async (text, imageUrls = []) => {
  const nvidia = getNvidiaClient();
  if (!nvidia) {
    return fallbackClassify(text);
  }

  const modelName = process.env.NVIDIA_MODEL_NAME || 'meta/llama-3.1-8b-instruct';

  const systemPrompt = `You are an AI classifier for civic problem reports in Jharkhand (SIH Report_Maro portal).
Analyze the citizen report and return a JSON object with:
- "category": must be exactly one of ["water", "road", "health", "other"]
- "priority": must be exactly one of ["low", "medium", "high"]
- "confidence": float between 0.0 and 1.0 indicating report clarity/certainty
- "reasoning": 1 brief sentence justifying category & priority choice

Respond ONLY with valid JSON. No markdown formatting.`;

  try {
    const userMessageContent = `Problem Report Text: "${text}"`;

    const response = await nvidia.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessageContent },
      ],
      temperature: 0.2,
      max_tokens: 200,
    });

    const rawOutput = response.choices[0]?.message?.content?.trim() || '';
    const cleanJson = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    // Validate enums strictly against database model
    const validCategories = ['water', 'road', 'health', 'other'];
    const validPriorities = ['low', 'medium', 'high'];

    const category = validCategories.includes(parsed.category) ? parsed.category : 'other';
    const priority = validPriorities.includes(parsed.priority) ? parsed.priority : 'medium';
    const confidence = typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.85;

    return { category, priority, confidence };
  } catch (err) {
    console.error(`⚠️ [AI Worker] NVIDIA API call failed (${err.message}). Using fallback classification.`);
    return fallbackClassify(text);
  }
};

/**
 * BullMQ Worker Instance with Rate Limiting (30 RPM safely under 35 RPM cap)
 */
const worker = new Worker(
  'classification-queue',
  async (job) => {
    const { problemId, text, imageUrls } = job.data;
    console.log(`🧠 [Worker] Processing job for problem: ${problemId}`);

    // 1. Run AI classification using NVIDIA NIM API
    const { category, priority, confidence } = await analyzeProblemWithAI(text, imageUrls);

    console.log(`📊 [Worker] Result: Category=${category}, Priority=${priority}, Confidence=${confidence}`);

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
      return { success: true, category, priority, confidence };
    } catch (error) {
      console.error(`❌ [Worker] Failed to update problem ${problemId}:`, error.message);
      throw error; // BullMQ retries automatically
    }
  },
  {
    connection: redis,
    concurrency: 2,
    limiter: {
      max: 30,          // Maximum 30 requests per minute (strictly <= 35 RPM limit)
      duration: 60000,  // 1 minute window
    },
  }
);

worker.on('completed', (job) => {
  console.log(`✅ [Worker] Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ [Worker] Job ${job.id} failed: ${err.message}`);
});

console.log('🚀 NVIDIA AI Worker started with 35 RPM Rate Limiter protection! Waiting for jobs...');

module.exports = worker;