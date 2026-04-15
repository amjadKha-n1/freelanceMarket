import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import "../styles/forms.css";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        skills: Array.isArray(user.skills)
          ? user.skills.join(", ")
          : user.skills || "",
        avatar: user.avatar || "",
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim());

      await API.put("/users/me", {
        ...formData,
        skills: skillsArray,
      });
      navigate("/me");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
      console.log(error.response?.data);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-edit-page">
      <div className="profile-edit-container">
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <h1>Edit Profile</h1>
          <p className="form-subtitle">Update your personal information</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-icon">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              <span>👤</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <div className="input-icon">
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows="4"
              />
              <span>📝</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="skills">Skills (comma separated)</label>
            <div className="input-icon">
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., JavaScript, React, Node.js"
              />
              <span>⚡</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Avatar URL</label>
            <div className="input-icon">
              <input
                type="text"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Enter image URL"
              />
              <span>🖼️</span>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className={`auth-button ${updating ? "loading" : ""}`}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
