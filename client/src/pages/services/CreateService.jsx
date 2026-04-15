import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "../styles/forms.css";

const CreateService = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    deliveryTime: "",
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
      const { data } = await API.post("/services/create-service", formData);
      navigate("/services");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create service");
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Create New Service</h1>
          <p className="auth-subtitle">List your service on the marketplace</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="title">
              Service Title
            </label>
            <div className="input-icon">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Professional Web Development"
                required
              />
              <span>📋</span>
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="description">
              Description
            </label>
            <div className="input-icon">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service in detail..."
                rows="4"
                style={{
                  width: "100%",
                  padding: "14px 16px 14px 45px",
                  border: "2px solid transparent",
                  borderRadius: "var(--border-radius-sm)",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                  fontSize: "1rem",
                  resize: "vertical",
                  outline: "none",
                }}
                required
              />
              <span style={{ top: "20px", transform: "none" }}>📝</span>
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="category">
              Category
            </label>
            <div className="input-icon">
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Web Development, Design, Writing"
                required
              />
              <span>🏷️</span>
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="price">
              Price ($)
            </label>
            <div className="input-icon">
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price in USD"
                min="0"
                step="0.01"
                required
              />
              <span>💰</span>
            </div>
          </div>

          <div className="form-group">
            <label style={{ color: "white" }} htmlFor="deliveryTime">
              Delivery Time (days)
            </label>
            <div className="input-icon">
              <input
                type="number"
                id="deliveryTime"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                placeholder="Enter delivery time in days"
                min="1"
                required
              />
              <span>⏱️</span>
            </div>
          </div>

          <button
            type="submit"
            className={`auth-button ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Service"}
          </button>

          <div className="auth-link">
            Want to go back?
            <a
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                navigate("/services");
              }}
            >
              View Services
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateService;
