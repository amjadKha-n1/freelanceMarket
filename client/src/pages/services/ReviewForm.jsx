import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import "../styles/forms.css";

const ReviewForm = () => {
  const { orderId, serviceId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [serviceDetails, setServiceDetails] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [orderId, serviceId]);

  const fetchDetails = async () => {
    try {
      if (serviceId) {
        const { data } = await API.get(`/services/${serviceId}`);
        setServiceDetails(data.service);
      }
      if (orderId) {
        const { data } = await API.get(`/orders/${orderId}`);
        setOrderDetails(data.order);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setError("Failed to load service details");
    }
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
    setError("");
  };

  const handleRatingHover = (rating) => {
    setHoverRating(rating);
  };

  const handleRatingLeave = () => {
    setHoverRating(0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const reviewData = {
        order: orderId,
        service: serviceId,
        rating: formData.rating,
        comment: formData.comment,
      };

      await API.post(`/reviews/create-review/${serviceId}`, reviewData);
      setSuccess("Review submitted successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit review");
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    const ratingValue = hoverRating || formData.rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={`star-btn ${i <= ratingValue ? "active" : ""}`}
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => handleRatingHover(i)}
          onMouseLeave={handleRatingLeave}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  const getRatingLabel = () => {
    const rating = formData.rating;
    if (rating === 0) return "Select a rating";
    if (rating === 1) return "Poor - Needs improvement";
    if (rating === 2) return "Fair - Could be better";
    if (rating === 3) return "Good - Satisfied";
    if (rating === 4) return "Very Good - Impressed";
    if (rating === 5) return "Excellent - Outstanding!";
    return "";
  };

  return (
    <div className="auth-page">
      <div className="auth-container" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit} className="auth-form">
          <h1>Write a Review</h1>
          <p className="auth-subtitle">
            Share your experience with this service
          </p>

          {/* Service/Order Info */}
          {(serviceDetails || orderDetails) && (
            <div className="service-info-card">
              {serviceDetails && (
                <>
                  <div className="service-info-header">
                    {serviceDetails.images?.[0] && (
                      <img
                        src={serviceDetails.images[0]}
                        alt={serviceDetails.title}
                        className="service-thumb"
                      />
                    )}
                    <div className="service-info-content">
                      <h3>{serviceDetails.title}</h3>
                      <p className="service-category">
                        {serviceDetails.category}
                      </p>
                      <p className="service-price">${serviceDetails.price}</p>
                    </div>
                  </div>
                  {orderDetails && (
                    <div className="order-info">
                      <span>
                        Order completed:{" "}
                        {new Date(orderDetails.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Success Message */}
          {success && <div className="success-message">{success}</div>}

          {/* Rating Section */}
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <div className="rating-container">
              <div className="stars-wrapper">{renderStars()}</div>
              <div className="rating-label">{getRatingLabel()}</div>
            </div>
            <div className="rating-hint">
              Click on stars to rate your experience
            </div>
          </div>

          {/* Review Comment */}
          <div className="form-group">
            <label htmlFor="comment">Your Review</label>
            <div className="input-icon">
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Tell us about your experience with this service. What did you like? What could be improved?"
                rows="5"
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
                  fontFamily: "inherit",
                }}
              />
              <span style={{ top: "20px", transform: "none" }}>✍️</span>
            </div>
            <div className="field-hint">Minimum 10 characters recommended</div>
          </div>

          {/* Review Guidelines */}
          <div className="guidelines-card">
            <h4>📝 Review Guidelines</h4>
            <ul>
              <li>Be honest and constructive</li>
              <li>Focus on the service quality</li>
              <li>Mention what worked well</li>
              <li>Suggest improvements if any</li>
              <li>Avoid personal attacks or offensive language</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className={`auth-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>

          <div className="auth-link">
            <a
              href="/orders"
              onClick={(e) => {
                e.preventDefault();
                navigate("/orders");
              }}
            >
              ← Back to Orders
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
