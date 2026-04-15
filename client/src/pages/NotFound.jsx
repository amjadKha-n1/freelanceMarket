import { Link } from "react-router-dom";
import "./styles/notFound.css";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-content">
          <div className="notfound-animation">
            <div className="error-code">404</div>
            <div className="error-icon">🔍</div>
          </div>
          <h1>Page Not Found</h1>
          <p>
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="error-details">
            <p>
              The URL you entered might be incorrect, or the page might have
              been removed.
            </p>
          </div>
          <div className="notfound-actions">
            <Link to="/" className="home-btn">
              <span className="btn-icon">🏠</span>
              Go to Homepage
            </Link>
            <Link to="/services" className="services-btn">
              <span className="btn-icon">🔍</span>
              Browse Services
            </Link>
          </div>
          <div className="helpful-links">
            <p>Here are some helpful links instead:</p>
            <div className="links-grid">
              <Link to="/about">About Us</Link>
              <Link to="/services">Services</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
