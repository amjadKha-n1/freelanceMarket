import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/forms.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Create Account</h1>
          <p className="auth-subtitle">Join our community today</p>

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="name">
              Full Name
            </label>
            <div className="input-icon">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <span>👤</span>
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="email">
              Email Address
            </label>
            <div className="input-icon">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <span>📧</span>
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="password">
              Password
            </label>
            <div className="input-icon">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span>🔒</span>
            </div>
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>

          <div className="auth-link">
            Already have an account?
            <Link to="/login">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
