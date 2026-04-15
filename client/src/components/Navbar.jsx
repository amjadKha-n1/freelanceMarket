import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../pages/styles/navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/about" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">
            Freelance<span>Market</span>
          </span>
        </Link>

        {/* ✅ ADD SEARCH BAR - Desktop */}
        <form onSubmit={handleSearch} className="navbar-search">
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">
            🔍
          </button>
        </form>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <ul className="navbar-links">
            <li>
              <Link to="/about" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={isActive("/services") ? "active" : ""}
              >
                Browse Services
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/dashboard"
                  className={isActive("/dashboard") ? "active" : ""}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {user ? (
            <>
              {/* Role-specific actions */}
              <div className="navbar-actions">
                {user.role === "freelancer" && (
                  <Link
                    to="/services/create-service"
                    className="create-service-btn"
                  >
                    <span className="btn-icon">➕</span>
                    <span>Create Service</span>
                  </Link>
                )}

                {user.role === "admin" && (
                  <Link to="/admin" className="admin-btn">
                    <span className="btn-icon">👑</span>
                    <span>Admin</span>
                  </Link>
                )}
              </div>

              {/* Notifications */}
              <button className="notification-btn">
                <span className="notification-icon">🔔</span>
                <span className="notification-badge">3</span>
              </button>

              {/* Profile Dropdown */}
              <div className="profile-dropdown">
                <button
                  className="profile-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="profile-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <span>{user.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="profile-name" style={{ color: "gray" }}>
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {isProfileMenuOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-info">
                        <strong>{user.name}</strong>
                        <span className="user-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link to="/profile" className="dropdown-item">
                      <span className="item-icon">👤</span>
                      <span>My Profile</span>
                    </Link>
                    <Link to="/edit-profile" className="dropdown-item">
                      <span className="item-icon">⚙️</span>
                      <span>Account Settings</span>
                    </Link>

                    {user.role === "freelancer" && (
                      <>
                        <Link to="/services" className="dropdown-item">
                          <span className="item-icon">📋</span>
                          <span>My Services</span>
                        </Link>
                        <Link
                          to="/orders?role=freelancer"
                          className="dropdown-item"
                        >
                          <span className="item-icon">📦</span>
                          <span>My Orders</span>
                        </Link>
                      </>
                    )}

                    {user.role === "client" && (
                      <>
                        <Link
                          to="/orders?role=client"
                          className="dropdown-item"
                        >
                          <span className="item-icon">🛒</span>
                          <span>My Purchases</span>
                        </Link>
                        <Link to="/become-freelancer" className="dropdown-item">
                          <span className="item-icon">👨‍💻</span>
                          <span>Become a Freelancer</span>
                        </Link>
                      </>
                    )}

                    <div className="dropdown-divider"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item logout"
                    >
                      <span className="item-icon">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="login-btn">
                Login
              </Link>
              <Link to="/register" className="register-btn">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className={`mobile-menu-btn ${isMenuOpen ? "active" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <ul className="mobile-links">
              {/* ✅ ADD SEARCH TO MOBILE MENU */}
              <li className="mobile-search-item">
                <form onSubmit={handleSearch} className="mobile-search-form">
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mobile-search-input"
                  />
                  <button type="submit" className="mobile-search-btn">
                    🔍
                  </button>
                </form>
              </li>
              <li className="mobile-divider"></li>
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  <span className="mobile-icon">🏠</span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={() => setIsMenuOpen(false)}>
                  <span className="mobile-icon">🔍</span>
                  Browse Services
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <span className="mobile-icon">📊</span>
                    Dashboard
                  </Link>
                </li>
              )}

              {user && (
                <>
                  <li className="mobile-divider"></li>
                  <li>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <span className="mobile-icon">👤</span>
                      Profile
                    </Link>
                  </li>

                  {user.role === "freelancer" && (
                    <>
                      <li>
                        <Link
                          to="/create-service"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="mobile-icon">➕</span>
                          Create Service
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-services"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="mobile-icon">📋</span>
                          My Services
                        </Link>
                      </li>
                    </>
                  )}

                  {user.role === "admin" && (
                    <li>
                      <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                        <span className="mobile-icon">👑</span>
                        Admin Panel
                      </Link>
                    </li>
                  )}

                  <li className="mobile-divider"></li>
                  <li>
                    <button onClick={handleLogout} className="mobile-logout">
                      <span className="mobile-icon">🚪</span>
                      Logout
                    </button>
                  </li>
                </>
              )}

              {!user && (
                <>
                  <li className="mobile-divider"></li>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="mobile-login"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="mobile-register"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
