import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

const BecomeFreelancer = () => {
  const [formData, setFormData] = useState({
    skills: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
    setLoading(true);
    setError("");

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      const { data } = await API.post("/users/become-freelancer", {
        skills: skillsArray,
        bio: formData.bio,
      });
      navigate("/services");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit form");
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Become a Freelancer</h1>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="skills">
              Skills (comma-separated)
            </label>
            <div className="input-icon">
              <input
                type="text"
                id="skills"
                name="skills"
                placeholder="e.g., JavaScript, React, Node.js"
                value={formData.skills}
                onChange={handleChange}
                required
              />
              <span>⚡</span>
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="bio">
              Bio
            </label>
            <div className="input-icon">
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                required
              />
              <span>📝</span>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Submitting..." : "Become a Freelancer"}
          </button>

          <div className="auth-link">
            Return to
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomeFreelancer;
