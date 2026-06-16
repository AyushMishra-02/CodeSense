const axios = require('axios');
const OpenAI = require('openai');
const Review = require('../models/Review');
const User = require('../models/User');

// Initialize OpenAI client
const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

// System prompt for the AI reviewer
const SYSTEM_PROMPT = `You are CodeSense, an expert AI code reviewer. Analyze the submitted code and provide a detailed review.

You MUST respond with valid JSON in exactly this format:
{
  "summary": "A 2-3 sentence overall assessment of the code quality",
  "overallScore": <number from 1-10>,
  "categories": {
    "bugs": [
      {"line": <line_number or 0>, "issue": "description", "suggestion": "fix suggestion", "severity": "critical|warning|info"}
    ],
    "style": [
      {"line": <line_number or 0>, "issue": "description", "suggestion": "fix suggestion", "severity": "critical|warning|info"}
    ],
    "performance": [
      {"line": <line_number or 0>, "issue": "description", "suggestion": "fix suggestion", "severity": "critical|warning|info"}
    ],
    "security": [
      {"line": <line_number or 0>, "issue": "description", "suggestion": "fix suggestion", "severity": "critical|warning|info"}
    ]
  },
  "suggestions": ["improvement suggestion 1", "improvement suggestion 2"]
}

Rules:
- Be thorough but fair — don't over-flag minor issues
- Always provide actionable suggestions
- Use "critical" severity sparingly — only for actual bugs or security vulnerabilities
- Include line numbers when possible (0 if the issue is general)
- Limit to 5 items per category maximum
- Consider the preprocessing data provided for additional context`;

// Generate a mock review for demo/testing when no API key is set
const generateMockReview = (code, language) => {
  const lines = code.split('\n').length;
  return {
    summary: `This ${language} code contains ${lines} lines. The code structure is generally clean but has a few areas for improvement in error handling and code organization.`,
    overallScore: 7,
    categories: {
      bugs: [
        {
          line: Math.min(3, lines),
          issue: 'Potential null/undefined reference',
          suggestion: 'Add null checks before accessing object properties',
          severity: 'warning',
        },
      ],
      style: [
        {
          line: 1,
          issue: 'Consider adding documentation comments',
          suggestion: 'Add JSDoc/docstring comments to describe function purpose and parameters',
          severity: 'info',
        },
        {
          line: 0,
          issue: 'Inconsistent naming convention detected',
          suggestion: 'Use consistent camelCase (JS) or snake_case (Python) throughout',
          severity: 'info',
        },
      ],
      performance: [
        {
          line: 0,
          issue: 'Consider caching repeated computations',
          suggestion: 'Memoize or cache results of expensive operations that are called multiple times',
          severity: 'info',
        },
      ],
      security: [
        {
          line: 0,
          issue: 'Input validation recommended',
          suggestion: 'Validate and sanitize all user inputs before processing',
          severity: 'warning',
        },
      ],
    },
    suggestions: [
      'Add comprehensive error handling with try-catch blocks',
      'Consider breaking large functions into smaller, focused helper functions',
      'Add unit tests to cover edge cases',
      'Use constants for magic numbers and repeated string literals',
    ],
  };
};

// @desc    Submit code for AI review
// @route   POST /api/review
// @access  Private
const submitReview = async (req, res) => {
  try {
    const { code, language, fileName } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required',
      });
    }

    if (code.length > 50000) {
      return res.status(400).json({
        success: false,
        message: 'Code exceeds maximum length of 50,000 characters',
      });
    }

    // Create initial review record
    const review = await Review.create({
      user: req.user._id,
      code,
      language,
      fileName: fileName || 'untitled',
      status: 'processing',
    });

    // Step 1: Preprocess with Python service
    let preprocessData = null;
    try {
      const preprocessResponse = await axios.post(
        `${process.env.PYTHON_SERVICE_URL}/preprocess`,
        { code, language },
        { timeout: 10000 }
      );
      preprocessData = preprocessResponse.data;
      review.preprocessData = preprocessData;
    } catch (preprocessError) {
      console.warn('⚠️ Python preprocessing service unavailable, continuing without preprocessing');
    }

    // Step 2: Send to OpenAI for review
    const openai = getOpenAIClient();
    let aiReview;

    if (openai) {
      try {
        const userMessage = preprocessData
          ? `Language: ${language}\nPreprocessing Data: ${JSON.stringify(preprocessData)}\n\nCode:\n${code}`
          : `Language: ${language}\n\nCode:\n${code}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.3,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
        });

        aiReview = JSON.parse(completion.choices[0].message.content);
      } catch (aiError) {
        console.error('OpenAI API Error:', aiError.message);
        aiReview = generateMockReview(code, language);
      }
    } else {
      // No API key — use mock review
      aiReview = generateMockReview(code, language);
    }

    // Step 3: Save and return
    review.aiReview = aiReview;
    review.status = 'completed';
    await review.save();

    // Increment user review count
    await User.findByIdAndUpdate(req.user._id, { $inc: { reviewCount: 1 } });

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during code review',
    });
  }
};

// @desc    Get user's review history
// @route   GET /api/review/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-code'); // Don't send full code in list view

    const total = await Review.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching review history',
    });
  }
};

// @desc    Get single review by ID
// @route   GET /api/review/:id
// @access  Private
const getReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    res.json({
      success: true,
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { submitReview, getHistory, getReview };
