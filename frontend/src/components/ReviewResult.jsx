import { useState } from 'react';

const categoryConfig = {
  bugs: {
    icon: '🐛',
    label: 'Bugs & Errors',
    color: 'var(--error)',
  },
  style: {
    icon: '🎨',
    label: 'Code Style',
    color: 'var(--info)',
  },
  performance: {
    icon: '⚡',
    label: 'Performance',
    color: 'var(--warning)',
  },
  security: {
    icon: '🔒',
    label: 'Security',
    color: 'var(--accent-secondary)',
  },
};

const ReviewResult = ({ review }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    bugs: true,
    style: true,
    performance: true,
    security: true,
  });

  if (!review || !review.aiReview) return null;

  const { aiReview } = review;
  const score = aiReview.overallScore || 0;

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getScoreColor = () => {
    if (score >= 8) return 'var(--success)';
    if (score >= 5) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="review-result page-enter" id="review-result">
      {/* Score Section */}
      <div className="score-section">
        <div className="score-circle">
          <div>
            <span className="score-value" style={{ color: getScoreColor() }}>
              {score}
            </span>
            <span className="score-max">/10</span>
          </div>
        </div>
        <div className="score-details">
          <h3>Code Quality Score</h3>
          <p className="score-summary">{aiReview.summary}</p>
        </div>
      </div>

      {/* Categories */}
      {Object.entries(categoryConfig).map(([key, config]) => {
        const items = aiReview.categories?.[key] || [];
        if (items.length === 0) return null;

        return (
          <div className="review-category" key={key}>
            <button
              className="category-header"
              onClick={() => toggleCategory(key)}
              id={`category-${key}`}
            >
              <span className="category-icon">{config.icon}</span>
              <span>{config.label}</span>
              <span className="category-count">{items.length}</span>
            </button>

            {expandedCategories[key] && (
              <div className="category-items">
                {items.map((item, index) => (
                  <div className="review-item" key={index}>
                    <div className="review-item-header">
                      <span className={`severity-badge ${item.severity}`}>
                        {item.severity}
                      </span>
                      {item.line > 0 && (
                        <span className="review-line">Line {item.line}</span>
                      )}
                    </div>
                    <p className="review-issue">{item.issue}</p>
                    {item.suggestion && (
                      <p className="review-suggestion">💡 {item.suggestion}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Suggestions */}
      {aiReview.suggestions && aiReview.suggestions.length > 0 && (
        <div className="suggestions-section">
          <h3>
            <span>💡</span> Improvement Suggestions
          </h3>
          {aiReview.suggestions.map((suggestion, index) => (
            <div className="suggestion-item" key={index}>
              <span className="suggestion-bullet">→</span>
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewResult;
