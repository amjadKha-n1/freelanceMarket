import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/forms.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      setError("");
      navigate("/services");
    } catch (error) {
      setError(error.response?.data?.message || "Invalid Credentials");
      console.log(error.response?.data);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to continue to your account</p>

          {error && <div className="error-message">{error}</div>}

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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span>🔒</span>
            </div>
          </div>

          <button type="submit" className="auth-button">
            Sign In
          </button>

          <div className="auth-link">
            Don't have an account?
            <Link to="/register">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
