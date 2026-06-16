import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgScore: 0,
    topLanguage: '-',
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/review/history?limit=20');
      const reviewData = response.data.data;
      setReviews(reviewData);

      // Calculate stats
      if (reviewData.length > 0) {
        const totalScore = reviewData.reduce(
          (sum, r) => sum + (r.aiReview?.overallScore || 0),
          0
        );
        const avgScore = (totalScore / reviewData.length).toFixed(1);

        // Count languages
        const langCounts = {};
        reviewData.forEach((r) => {
          langCounts[r.language] = (langCounts[r.language] || 0) + 1;
        });
        const topLanguage =
          Object.entries(langCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
          '-';

        setStats({
          totalReviews: response.data.pagination?.total || reviewData.length,
          avgScore,
          topLanguage,
        });
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-state" style={{ minHeight: '60vh' }}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page page-enter" id="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>
            Welcome back,{' '}
            <span className="gradient-text">{user?.username}</span>
          </h1>
          <p>Here's an overview of your code reviews</p>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value gradient-text">
              {stats.totalReviews}
            </div>
            <div className="stat-label">Total Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {stats.avgScore}
            </div>
            <div className="stat-label">Avg Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--info)' }}>
              {stats.topLanguage}
            </div>
            <div className="stat-label">Top Language</div>
          </div>
        </div>

        {/* Reviews List */}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 20 }}>
          Recent Reviews
        </h2>

        {reviews.length === 0 ? (
          <div className="no-reviews">
            <div className="empty-icon">📋</div>
            <h3>No Reviews Yet</h3>
            <p>Submit your first code review to get started!</p>
            <Link to="/editor" className="btn btn-primary" id="go-to-editor">
              Open Editor →
            </Link>
          </div>
        ) : (
          <div className="reviews-list">
            {reviews.map((review) => (
              <div className="review-card" key={review._id} id={`review-${review._id}`}>
                <div
                  className={`review-card-score ${getScoreClass(
                    review.aiReview?.overallScore || 0
                  )}`}
                >
                  {review.aiReview?.overallScore || '-'}
                </div>
                <div className="review-card-info">
                  <div className="review-card-name">
                    {review.fileName || 'Untitled Review'}
                  </div>
                  <div className="review-card-meta">
                    <span className="review-card-lang">
                      {review.language}
                    </span>
                    <span>{formatDate(review.createdAt)}</span>
                    <span>
                      {review.aiReview?.categories
                        ? Object.values(review.aiReview.categories).reduce(
                            (sum, cat) => sum + (cat?.length || 0),
                            0
                          )
                        : 0}{' '}
                      issues
                    </span>
                  </div>
                </div>
                <span className="review-card-arrow">→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
