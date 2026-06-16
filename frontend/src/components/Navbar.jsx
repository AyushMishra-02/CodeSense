import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <div className="logo-icon">CS</div>
          <span>CodeSense</span>
        </Link>

        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link
                to="/editor"
                className={`nav-link ${isActive('/editor') ? 'active' : ''}`}
                id="nav-editor"
              >
                Editor
              </Link>
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                id="nav-dashboard"
              >
                Dashboard
              </Link>
              <div className="nav-user">
                <div className="nav-avatar">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="nav-username">{user?.username}</span>
              </div>
              <button
                onClick={logout}
                className="nav-btn nav-btn-ghost"
                id="nav-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-btn nav-btn-ghost"
                id="nav-login"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="nav-btn nav-btn-primary"
                id="nav-register"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
