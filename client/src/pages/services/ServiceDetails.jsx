import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axios";
import "../styles/services.css";
const ServiceDetail = () => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const { data } = await API.get(`/services/${id}?populate=freelancer`);
        setService(data.service);
      } catch (error) {
        console.log("Error fetching service Details", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const { data } = await API.get(`/reviews/service/${id}`);
        setReviews(data.reviews);
        setService((prevService) => ({
          ...prevService,
          rating: data.service.rating,
          totalReviews: data.service.totalReviews,
          ratingDistribution: data.service.ratingDistribution,
        }));
      } catch (error) {
        console.log("Error fetching reviews", error);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchDetails();
    fetchReviews();
  }, [id]);

  const handleOrder = async () => {
    try {
      const response = await API.post("/orders/create-order", {
        serviceId: id,
      });
      const { checkoutUrl } = response.data;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Error creating Order!", error);
      alert("Failed to create Order. Please try again!");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="error-container">
        <h2>😕 Service not found</h2>
        <p>The service you're looking for doesn't exist or has been removed.</p>
        <button className="back-btn" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  const numericRating = Number(service.rating) || 0;
  const roundedRating = Math.round(numericRating);

  return (
    <div className="service-detail-page">
      {/* Hero Section with Background */}
      <div className="detail-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-breadcrumb">
            <span onClick={() => (window.location.href = "/services")}>
              Services
            </span>
            <span className="separator">›</span>
            <span>{service.category}</span>
          </div>
          <h1 className="hero-title">{service.title}</h1>
          <div className="hero-meta">
            <div className="hero-rating">
              <span className="star">★</span>
              <span className="rating-value">{service.rating || "5.0"}</span>
              <span className="rating-count">
                ({service.totalOrders || 0} orders)
              </span>
            </div>
            <div className="hero-status">
              <span className={`status-dot ${service.status}`}></span>
              <span className="status-text">{service.status}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-main">
          {/* Image Gallery Section */}
          <div className="gallery-section">
            {service.images && service.images.length > 0 ? (
              <>
                <div className="main-image-card">
                  <img
                    src={service.images[selectedImage]}
                    alt={service.title}
                    className="main-image"
                  />
                  {service.images.length > 1 && (
                    <div className="image-counter">
                      {selectedImage + 1} / {service.images.length}
                    </div>
                  )}
                </div>

                {service.images.length > 1 && (
                  <div className="thumbnail-grid">
                    {service.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`thumbnail-item ${
                          selectedImage === idx ? "active" : ""
                        }`}
                        onClick={() => setSelectedImage(idx)}
                      >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image-card">
                <span className="no-image-icon">📸</span>
                <p>No images available for this service</p>
              </div>
            )}
          </div>

          {/* Service Description Section */}
          <div className="description-section">
            <h2>About This Service</h2>
            <div className="description-content">
              <p>{service.description}</p>
            </div>

            {/* Key Features */}
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <h4>Fast Delivery</h4>
                  <p>Get your work done in {service.deliveryTime} days</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💎</div>
                <div className="feature-text">
                  <h4>Premium Quality</h4>
                  <p>High-quality work guaranteed</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔄</div>
                <div className="feature-text">
                  <h4>Unlimited Revisions</h4>
                  <p>Until you're 100% satisfied</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">
                  <h4>Secure Payment</h4>
                  <p>Your money is safe with us</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2>Client Reviews</h2>

            {/* Rating Summary */}
            <div className="reviews-header-stats">
              <div className="reviews-rating-summary">
                <div className="average-rating">{service.rating || "0"}</div>
                <div>
                  <div className="average-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          color: star <= roundedRating ? "#fbbf24" : "#334155",
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="total-reviews">
                    Based on {service.totalReviews || 0} reviews
                  </div>
                </div>
              </div>

              {/* Rating Distribution Bars */}
              <div className="rating-bars">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="rating-bar-item">
                    <span className="rating-bar-label">{star} ★</span>
                    <div className="rating-bar-bg">
                      <div
                        className="rating-bar-fill"
                        style={{
                          width: `${service.ratingDistribution?.[star] || 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="rating-bar-count">
                      {Math.round(service.ratingDistribution?.[star] || 0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {reviewsLoading ? (
              <div className="reviews-loading">
                <div className="spinner-small"></div>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.client?.avatar ? (
                            <img
                              src={review.client.avatar}
                              alt={review.client.name}
                            />
                          ) : (
                            <span>{review.client?.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">
                            {review.client?.name}
                          </span>
                          <div className="review-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`star ${
                                  star <= review.rating ? "filled" : ""
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="review-date">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>

                    <div className="review-content">
                      <p className="review-text">{review.comment}</p>
                      {review.verifiedPurchase && (
                        <span className="review-verified">
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>

                    {review.freelancerResponse && (
                      <div className="freelancer-response">
                        <div className="freelancer-response-header">
                          <span>👤 Seller Response</span>
                        </div>
                        <p className="freelancer-response-text">
                          {review.freelancerResponse}
                        </p>
                      </div>
                    )}

                    <div className="review-footer">
                      <button className="helpful-btn">👍 Helpful</button>
                      <button className="helpful-btn">Report</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <div className="no-reviews-icon">📝</div>
                <p>No reviews yet. Be the first to review this service!</p>
                <button className="be-first-review-btn">Write a Review</button>
              </div>
            )}
          </div>
        </div>

        <div className="detail-sidebar">
          {/* Price Card */}
          <div className="price-card">
            <div className="price-header">
              <span className="price-label">Starting from</span>
              <div className="price-value-large">
                ${service.price}
                <span className="price-period">/project</span>
              </div>
            </div>

            <div className="price-details">
              <div className="detail-row">
                <span>Delivery time</span>
                <span className="detail-value">
                  {service.deliveryTime} days
                </span>
              </div>
              <div className="detail-row">
                <span>Category</span>
                <span className="detail-value">{service.category}</span>
              </div>
              <div className="detail-row">
                <span>Orders completed</span>
                <span className="detail-value">{service.totalOrders || 0}</span>
              </div>
            </div>
            <div>
              <button onClick={handleOrder} className="order-now-btn">
                Continue to Order
              </button>
            </div>
            <button className="contact-btn">Contact Seller</button>
          </div>

          {/* Freelancer Card */}
          {service.freelancer && (
            <div className="freelancer-card">
              <h3>About the Seller</h3>
              <div className="freelancer-profile">
                <div className="freelancer-avatar-large">
                  {service.freelancer.avatar ? (
                    <img
                      src={service.freelancer.avatar}
                      alt={service.freelancer.name}
                    />
                  ) : (
                    <div className="avatar-placeholder-large">
                      {service.freelancer.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="freelancer-info-large">
                  <h4>{service.freelancer.name}</h4>
                  <div className="freelancer-badge">
                    {service.freelancer.role === "freelancer"
                      ? "⭐ Professional"
                      : "admin"}
                  </div>
                </div>
              </div>

              <div className="freelancer-stats-large">
                <div className="stat-block">
                  <span className="stat-number">
                    {service.freelancer.rating || "5.0"}
                  </span>
                  <span className="stat-label">Rating</span>
                </div>
                <div className="stat-block">
                  <span className="stat-number">
                    {service.freelancer.totalReviews || 0}
                  </span>
                  <span className="stat-label">Reviews</span>
                </div>
                <div className="stat-block">
                  <span className="stat-number">
                    {new Date(service.freelancer.createdAt).getFullYear()}
                  </span>
                  <span className="stat-label">Joined</span>
                </div>
              </div>

              {service.freelancer.bio && (
                <p className="freelancer-bio-large">{service.freelancer.bio}</p>
              )}

              {service.freelancer.skills &&
                service.freelancer.skills.length > 0 && (
                  <div className="freelancer-skills-large">
                    {service.freelancer.skills.map((skill, idx) => (
                      <span key={idx} className="skill-badge">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              <Link to={`/profile/${service.freelancer._id}`}>
                <button className="view-profile-btn">View Full Profile</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
