import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "../styles/profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = user && profile && user._id === profile._id;
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endPoint = id ? `/users/${id}` : "/users/me";
        const { data } = await API.get(endPoint);
        setProfile(data.user || data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          {/* Cover Photo Area */}
          <div className="profile-cover">
            <div className="cover-gradient"></div>
          </div>

          {/* Avatar Section - Fixed positioning */}
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Role Badge - Moved below avatar */}
            <div className={`role-badge ${profile?.role}`}>
              {profile?.role === "freelancer"
                ? "⭐ Freelancer"
                : profile?.role === "admin"
                ? "👑 Admin"
                : "👤 Client"}
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="profile-info">
            <h1 className="profile-name">{profile?.name}</h1>
            <div className="profile-email">
              <span className="info-icon">📧</span>
              {profile?.email}
            </div>

            {profile?.bio && (
              <div className="profile-bio-section">
                <h3>About Me</h3>
                <p className="profile-bio">{profile.bio}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">⭐</span>
                <div className="stat-content">
                  <span className="stat-value">{profile?.rating || "0"}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📝</span>
                <div className="stat-content">
                  <span className="stat-value">
                    {profile?.totalReviews || "0"}
                  </span>
                  <span className="stat-label">Reviews</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📅</span>
                <div className="stat-content">
                  <span className="stat-value">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          { year: "numeric" }
                        )
                      : "2024"}
                  </span>
                  <span className="stat-label">Joined</span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            {profile?.skills && profile.skills.length > 0 && (
              <div className="skills-section">
                <h3>Skills & Expertise</h3>
                <div className="skills-container">
                  {profile.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info Grid */}
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {profile?.createdAt ? formatDate(profile.createdAt) : "N/A"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Updated</span>
                <span className="info-value">
                  {profile?.updatedAt ? formatDate(profile.updatedAt) : "N/A"}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Type</span>
                <span className="info-value capitalize">{profile?.role}</span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID</span>
                <span className="info-value text-mono">
                  {profile?._id?.slice(-8)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="profile-actions">
              {isOwnProfile && (
                <Link to="/edit-profile" className="edit-profile-btn">
                  <span className="btn-icon">✎</span>
                  Edit Profile
                </Link>
              )}
              <Link to="/dashboard" className="dashboard-btn">
                <span className="btn-icon">📊</span>
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
