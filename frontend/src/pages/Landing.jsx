import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing page-enter" id="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            AI-Powered Code Analysis
          </div>

          <h1 className="hero-title">
            Write Better Code with{' '}
            <span className="gradient-text">AI Reviews</span>
          </h1>

          <p className="hero-subtitle">
            Paste your code, get instant AI-powered feedback on bugs, style,
            performance, and security. Built for developers who ship quality
            code.
          </p>

          <div className="hero-actions">
            <Link
              to={isAuthenticated ? '/editor' : '/register'}
              className="btn btn-primary"
              id="cta-primary"
            >
              Start Reviewing →
            </Link>
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="btn btn-secondary"
              id="cta-secondary"
            >
              {isAuthenticated ? 'View Dashboard' : 'Sign In'}
            </Link>
          </div>

          {/* Code Preview Window */}
          <div className="hero-preview">
            <div className="code-window">
              <div className="code-window-header">
                <div className="code-window-dot red"></div>
                <div className="code-window-dot yellow"></div>
                <div className="code-window-dot green"></div>
                <span className="code-window-title">review.py</span>
              </div>
              <div className="code-window-body">
                <div>
                  <span className="keyword">def</span>{' '}
                  <span className="function">process_data</span>(data):
                </div>
                <div>
                  {'    '}
                  <span className="comment">
                    # CodeSense: ⚠️ Missing input validation
                  </span>
                </div>
                <div>
                  {'    '}result = []
                </div>
                <div>
                  {'    '}
                  <span className="keyword">for</span> item{' '}
                  <span className="keyword">in</span> data:
                </div>
                <div>
                  {'        '}
                  <span className="keyword">if</span> item[
                  <span className="string">"status"</span>] =={' '}
                  <span className="string">"active"</span>:
                </div>
                <div>
                  {'            '}result.append(item[
                  <span className="string">"value"</span>] *{' '}
                  <span className="number">2</span>)
                </div>
                <div>
                  {'    '}
                  <span className="keyword">return</span> result
                </div>
                <div></div>
                <div>
                  <span className="comment">
                    # ✅ Score: 6/10 | 2 bugs, 1 style, 1 performance issue
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <p className="section-label">Features</p>
          <h2 className="section-title">
            Everything you need for{' '}
            <span className="gradient-text">better code</span>
          </h2>
          <p className="section-subtitle">
            CodeSense analyzes your code across multiple dimensions, providing
            actionable feedback in seconds.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon purple">🐛</div>
              <h3>Bug Detection</h3>
              <p>
                Identify potential bugs, null references, and logic errors before
                they reach production.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon green">🎨</div>
              <h3>Style Analysis</h3>
              <p>
                Get recommendations on naming conventions, code organization, and
                adherence to best practices.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon orange">⚡</div>
              <h3>Performance Insights</h3>
              <p>
                Detect performance bottlenecks, unnecessary computations, and
                optimization opportunities.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon red">🔒</div>
              <h3>Security Scanning</h3>
              <p>
                Find security vulnerabilities like SQL injection, XSS, and
                insecure data handling.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">📝</div>
              <h3>Multi-Language</h3>
              <p>
                Support for JavaScript, Python, Java, C++, TypeScript, and Go
                with language-specific analysis.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon violet">📊</div>
              <h3>Review History</h3>
              <p>
                Track your code quality over time with a full history of all your
                reviews and scores.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
