const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      required: [true, 'Code is required'],
      maxlength: [50000, 'Code cannot exceed 50,000 characters'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      enum: ['javascript', 'python', 'java', 'cpp', 'go', 'typescript'],
    },
    fileName: {
      type: String,
      default: 'untitled',
    },
    // Preprocessing results from Python service
    preprocessData: {
      stats: {
        lines: Number,
        functions: Number,
        classes: Number,
        complexity_score: String,
      },
      lint_issues: [
        {
          line: Number,
          message: String,
          severity: String,
        },
      ],
      ast_valid: Boolean,
    },
    // AI review response
    aiReview: {
      summary: String,
      overallScore: Number,
      categories: {
        bugs: [
          {
            line: Number,
            issue: String,
            suggestion: String,
            severity: { type: String, enum: ['critical', 'warning', 'info'] },
          },
        ],
        style: [
          {
            line: Number,
            issue: String,
            suggestion: String,
            severity: { type: String, enum: ['critical', 'warning', 'info'] },
          },
        ],
        performance: [
          {
            line: Number,
            issue: String,
            suggestion: String,
            severity: { type: String, enum: ['critical', 'warning', 'info'] },
          },
        ],
        security: [
          {
            line: Number,
            issue: String,
            suggestion: String,
            severity: { type: String, enum: ['critical', 'warning', 'info'] },
          },
        ],
      },
      suggestions: [String],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user history queries
reviewSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
