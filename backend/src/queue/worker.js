// src/queue/worker.js
const { Worker } = require('bullmq');
const axios = require('axios');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const { getRedisClient } = require('../config/redis');
const connectDB = require('../config/db');
const Problem = require('../models/problem.model');
const User = require('../models/user.model');

// Get Redis connection
const redis = getRedisClient();

// Connect to MongoDB if not connected so worker has DB access
if (mongoose.connection.readyState === 0) {
  connectDB().catch((err) => console.error('❌ [Worker] MongoDB connection error:', err.message));
}

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
  const words = text.toLowerCase().split(/\s+/);
  const categories = {
    water: ['water', 'pond', 'river', 'drinking', 'flood', 'irrigation', 'drainage', 'pipeline', 'leakage', 'contamination'],
    road: ['road', 'pothole', 'bridge', 'construction', 'drain', 'street', 'highway', 'asphalt'],
    health: ['hospital', 'doctor', 'medicine', 'disease', 'health', 'clinic', 'sanitation', 'ambulance'],
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

  const subCategoryDefaults = {
    water: 'Water Supply & Quality',
    road: 'Road Infrastructure & Maintenance',
    health: 'Healthcare Facilities & Sanitation',
    other: 'Civic Infrastructure',
  };

  const urgentWords = ['emergency', 'critical', 'urgent', 'death', 'accident', 'flood', 'hazard'];
  const priority = urgentWords.some((w) => words.includes(w)) ? 'high' : 'medium';

  return {
    category: bestCategory,
    sub_category: subCategoryDefaults[bestCategory] || 'General Civic Issue',
    priority,
    confidence: 0.70,
    reasoning: 'Rule-based classification applied based on keyword matches in description.',
    required_expertise: [
      bestCategory === 'water'
        ? 'Hydraulics & Water Management'
        : bestCategory === 'road'
        ? 'Civil Engineering'
        : bestCategory === 'health'
        ? 'Public Health & Sanitation'
        : 'General Engineering',
    ],
  };
};

/**
 * 🧠 NVIDIA Build Model Inference Call (Categorization, Prioritization, Expertise Extraction)
 */
const analyzeProblemWithAI = async (text, imageUrls = []) => {
  const nvidia = getNvidiaClient();
  if (!nvidia) {
    return fallbackClassify(text);
  }

  const modelName = process.env.NVIDIA_MODEL_NAME || 'meta/llama-3.2-11b-vision-instruct';

  const systemPrompt = `You are an AI classifier for civic problem reports in Jharkhand (SIH Report_Maro portal).
Analyze the citizen report and return a JSON object with:
- "category": must be exactly one of ["water", "road", "health", "other"]
- "sub_category": specific free-text sub-category (e.g. "Pothole & Surface Damage", "Drinking Water Supply Leakage", "Hospital Sanitation & Supply")
- "priority": must be exactly one of ["low", "medium", "high"]
- "confidence": float between 0.0 and 1.0 indicating report clarity/certainty
- "reasoning": 1 brief sentence justifying category & priority choice
- "required_expertise": array of 1 to 4 technical/engineering expertise strings (e.g. ["Civil Engineering", "Structural Analysis", "Hydraulics"])

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
      max_tokens: 350,
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
    const sub_category = typeof parsed.sub_category === 'string' && parsed.sub_category.trim() ? parsed.sub_category.trim() : null;
    const reasoning = typeof parsed.reasoning === 'string' && parsed.reasoning.trim() ? parsed.reasoning.trim() : 'AI classification completed based on problem text.';
    const required_expertise = Array.isArray(parsed.required_expertise) ? parsed.required_expertise.filter((e) => typeof e === 'string' && e.trim()) : [];

    return { category, sub_category, priority, confidence, reasoning, required_expertise };
  } catch (err) {
    console.error(`⚠️ [AI Worker] NVIDIA API call failed (${err.message}). Using fallback classification.`);
    return fallbackClassify(text);
  }
};

/**
 * 🔍 Semantic Duplicate Detection against recent problems in same location.district
 */
const checkForDuplicates = async (problem) => {
  try {
    const district = problem.location?.district;
    if (!district) {
      return {
        is_duplicate: false,
        similarity_score: 0,
        duplicate_of: null,
        reason: 'No district information available for duplicate comparison.',
      };
    }

    // Query recent problems in the same district, excluding current problem
    const candidates = await Problem.find({
      'location.district': district,
      _id: { $ne: problem._id },
    })
      .sort({ created_at: -1 })
      .limit(10)
      .select('_id title description category sub_category created_at');

    if (!candidates || candidates.length === 0) {
      return {
        is_duplicate: false,
        similarity_score: 0,
        duplicate_of: null,
        reason: 'No prior reports found in this district.',
      };
    }

    const nvidia = getNvidiaClient();
    if (nvidia) {
      const modelName = process.env.NVIDIA_MODEL_NAME || 'meta/llama-3.2-11b-vision-instruct';

      const candidateSummary = candidates
        .map((c, idx) => `[ID: ${c._id}] Title: "${c.title}", Description: "${c.description}"`)
        .join('\n');

      const systemPrompt = `You are a duplicate detector for civic issue reports in Jharkhand.
Compare the NEW REPORT against existing CANDIDATE REPORTS from the same district.
Return a JSON object with:
- "is_duplicate": boolean (true if new report describes the same underlying physical issue or location problem as an existing candidate)
- "similarity_score": float between 0.0 and 1.0 (highest similarity score against any candidate)
- "duplicate_of": string ID of the candidate problem if is_duplicate is true (otherwise null)
- "reason": 1 brief sentence explaining why it is or is not a duplicate

Respond ONLY with valid JSON. No markdown formatting.`;

      const userContent = `NEW REPORT:
Title: "${problem.title || ''}"
Description: "${problem.description || ''}"

EXISTING CANDIDATES IN DISTRICT (${district}):
${candidateSummary}`;

      const response = await nvidia.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userContent },
        ],
        temperature: 0.1,
        max_tokens: 250,
      });

      const rawOutput = response.choices[0]?.message?.content?.trim() || '';
      const cleanJson = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const candidateIds = candidates.map((c) => c._id.toString());
      const duplicate_of = parsed.is_duplicate && candidateIds.includes(parsed.duplicate_of) ? parsed.duplicate_of : null;

      return {
        is_duplicate: Boolean(parsed.is_duplicate && duplicate_of),
        similarity_score: typeof parsed.similarity_score === 'number' ? Math.max(0, Math.min(1, parsed.similarity_score)) : 0,
        duplicate_of,
        reason: typeof parsed.reason === 'string' ? parsed.reason : 'Duplicate evaluation completed via AI.',
      };
    }

    // Fallback: rule-based Jaccard similarity check on title/description tokens
    const textTokens = new Set(`${problem.title || ''} ${problem.description || ''}`.toLowerCase().match(/\w+/g) || []);
    let bestCandidate = null;
    let maxSimilarity = 0;

    for (const cand of candidates) {
      const candTokens = new Set(`${cand.title} ${cand.description}`.toLowerCase().match(/\w+/g) || []);
      const intersection = [...textTokens].filter((t) => candTokens.has(t)).length;
      const union = new Set([...textTokens, ...candTokens]).size;
      const sim = union > 0 ? intersection / union : 0;
      if (sim > maxSimilarity) {
        maxSimilarity = sim;
        bestCandidate = cand;
      }
    }

    const is_duplicate = maxSimilarity >= 0.6;
    return {
      is_duplicate,
      similarity_score: Math.round(maxSimilarity * 100) / 100,
      duplicate_of: is_duplicate && bestCandidate ? bestCandidate._id : null,
      reason: is_duplicate ? `Rule-based match: highly similar wording to candidate report ${bestCandidate._id}.` : 'Rule-based check: no duplicate found.',
    };
  } catch (err) {
    console.error(`⚠️ [AI Worker] Duplicate check failed (${err.message}). Returning safe default.`);
    return {
      is_duplicate: false,
      similarity_score: 0,
      duplicate_of: null,
      reason: 'Duplicate check skipped due to error.',
    };
  }
};

/**
 * 🎓 University Recommendation Matching based on required_expertise and university_profile
 */
const matchUniversities = async (problem, required_expertise = []) => {
  try {
    const universities = await User.find({ role: 'university' }).select('_id full_name organization district university_profile');

    if (!universities || universities.length === 0) {
      return [];
    }

    const problemKeywords = [
      problem.category,
      problem.sub_category,
      ...required_expertise,
      ...(problem.description ? problem.description.toLowerCase().split(/\s+/) : []),
    ].filter(Boolean).map((k) => String(k).toLowerCase());

    const recommendations = [];

    for (const uni of universities) {
      const profile = uni.university_profile || {};
      const depts = profile.departments || [];
      const research = profile.research_areas || [];
      const caps = profile.technical_capabilities || [];

      const uniKeywords = [...depts, ...research, ...caps].map((k) => k.toLowerCase());

      if (uniKeywords.length === 0) {
        continue; // Graceful degradation: no profile populated yet
      }

      const matchedDepts = depts.filter((dept) =>
        problemKeywords.some((pk) => pk.includes(dept.toLowerCase()) || dept.toLowerCase().includes(pk))
      );

      const overlapCount = uniKeywords.filter((uk) =>
        problemKeywords.some((pk) => pk.includes(uk) || uk.includes(pk))
      ).length;

      if (overlapCount > 0) {
        const match_score = Math.min(1, Math.round((overlapCount / Math.max(1, required_expertise.length + 2)) * 100) / 100);
        recommendations.push({
          university: uni._id,
          match_score,
          matched_departments: matchedDepts.length > 0 ? matchedDepts : depts.slice(0, 2),
          reason: `Matched based on expertise alignment (${overlapCount} matching terms) with ${uni.organization || uni.full_name}.`,
        });
      }
    }

    // Sort by match score descending
    recommendations.sort((a, b) => b.match_score - a.match_score);
    return recommendations.slice(0, 5);
  } catch (err) {
    console.error(`⚠️ [AI Worker] University matching failed (${err.message}). Returning empty recommendations.`);
    return [];
  }
};

/**
 * BullMQ Worker Instance with Rate Limiting (15 RPM max jobs, safely under 35 RPM cap)
 */
const worker = new Worker(
  'classification-queue',
  async (job) => {
    const { problemId, text, imageUrls } = job.data;
    console.log(`🧠 [Worker] Processing job for problem: ${problemId}`);

    // Fetch problem document from DB (if available) for complete context
    let problemDoc = null;
    try {
      problemDoc = await Problem.findById(problemId);
    } catch (err) {
      console.warn(`⚠️ [Worker] Could not fetch problem document directly (${err.message})`);
    }

    const problemText = text || (problemDoc ? problemDoc.description : '');

    // 1. Run AI classification & expertise extraction
    const { category, sub_category, priority, confidence, reasoning, required_expertise } =
      await analyzeProblemWithAI(problemText, imageUrls);

    console.log(`📊 [Worker] Classification: Category=${category}, SubCategory=${sub_category}, Priority=${priority}, Confidence=${confidence}`);

    // Construct transient problem representation for downstream duplicate & university matching
    const currentProblem = problemDoc || {
      _id: problemId,
      title: problemDoc ? problemDoc.title : problemText.slice(0, 50),
      description: problemText,
      category,
      sub_category,
      location: problemDoc ? problemDoc.location : { district: '' },
    };

    // 2. Duplicate Detection
    const duplicate_check = await checkForDuplicates(currentProblem);
    console.log(`🔍 [Worker] Duplicate Check: is_duplicate=${duplicate_check.is_duplicate}, score=${duplicate_check.similarity_score}`);

    // 3. University Matching
    const recommended_universities = await matchUniversities(currentProblem, required_expertise);
    console.log(`🎓 [Worker] University Matching: Found ${recommended_universities.length} recommended universities`);

    // 4. Send complete results to Backend via Internal API
    try {
      const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:3000';
      await axios.patch(
        `${internalApiUrl}/api/internal/problems/${problemId}`,
        {
          category,
          sub_category,
          priority,
          confidence,
          ai_reasoning: reasoning,
          required_expertise,
          duplicate_check,
          recommended_universities,
          status: 'verified',
        },
        {
          headers: {
            'x-internal-api-key': process.env.INTERNAL_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(`✅ [Worker] Problem ${problemId} updated successfully with 5 AI functions`);
      return {
        success: true,
        category,
        sub_category,
        priority,
        confidence,
        ai_reasoning: reasoning,
        required_expertise,
        duplicate_check,
        recommended_universities,
      };
    } catch (error) {
      console.error(`❌ [Worker] Failed to update problem ${problemId}:`, error.message);
      throw error; // BullMQ retries automatically
    }
  },
  {
    connection: redis,
    concurrency: 2,
    limiter: {
      max: 15,          // Maximum 15 jobs per minute (max 30 NIM calls/min under 35 RPM cap)
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