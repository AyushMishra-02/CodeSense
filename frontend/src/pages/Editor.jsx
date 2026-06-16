import { useState, useCallback } from 'react';
import CodeEditor from '../components/CodeEditor';
import LanguageSelector from '../components/LanguageSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import ReviewResult from '../components/ReviewResult';
import api from '../utils/api';

const defaultCode = `// Welcome to CodeSense! 
// Paste your code here or start typing, then click "Review Code"

function fetchUserData(userId) {
  var data = null;
  
  fetch("/api/users/" + userId)
    .then(res => res.json())
    .then(result => {
      data = result;
      console.log("Got data:", data);
    });
  
  // Bug: data is still null here due to async
  if (data.name == "admin") {
    return data;
  }
  
  return data;
}
`;

const Editor = () => {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState('');

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
  }, []);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setError('');
    setLoading(true);
    setReview(null);

    try {
      const response = await api.post('/review', {
        code,
        language,
        fileName: `review.${language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'typescript' ? 'ts' : 'js'}`,
      });
      setReview(response.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to submit review. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="editor-page page-enter" id="editor-page">
      <div className="editor-layout">
        {/* Editor Panel */}
        <div className="editor-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span className="icon">📝</span>
              Code Editor
            </div>
            <div className="panel-actions">
              <LanguageSelector
                language={language}
                onChange={setLanguage}
              />
            </div>
          </div>

          <div className="editor-body">
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              language={language}
            />
          </div>

          <div className="editor-footer">
            <div className="editor-stats">
              <span>{lineCount} lines</span>
              <span>{charCount} chars</span>
              <span>{language}</span>
            </div>
            <button
              className="btn btn-primary submit-btn"
              onClick={handleSubmit}
              disabled={loading || !code.trim()}
              id="submit-review"
            >
              {loading ? 'Reviewing...' : '✨ Review Code'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span className="icon">🔍</span>
              AI Review Results
            </div>
            {review && (
              <div className="panel-actions">
                <span
                  className="severity-badge info"
                  style={{ fontSize: '0.7rem' }}
                >
                  {review.aiReview?.categories
                    ? Object.values(review.aiReview.categories).reduce(
                        (sum, cat) => sum + (cat?.length || 0),
                        0
                      )
                    : 0}{' '}
                  issues found
                </span>
              </div>
            )}
          </div>

          <div className="results-body">
            {error && (
              <div className="alert alert-error" style={{ margin: '20px' }}>
                {error}
              </div>
            )}

            {loading && <LoadingSpinner />}

            {!loading && !review && !error && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No Review Yet</h3>
                <p>
                  Write or paste your code in the editor, then click "Review
                  Code" to get AI-powered feedback.
                </p>
              </div>
            )}

            {!loading && review && <ReviewResult review={review} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
