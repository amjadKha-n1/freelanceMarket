import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Layout from "../../components/Layout";
import "../styles/services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await API.get("/services");

        setServices(data.services);
      } catch (error) {
        console.error("Error fetching the services", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading amazing services...</p>
      </div>
    );
  }

  return (
    <div className="services-container">
      <div className="services-header">
        <h1>✨ Discover Amazing Services</h1>
        <p>Find the perfect freelance service for your project</p>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div
            key={service._id}
            className="service-card"
            onClick={() => navigate(`/services/${service._id}`)}
          >
            {/* Images Section */}
            <div className="service-images">
              {service.images && service.images.length > 0 ? (
                <div className="image-gallery">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="main-image"
                  />
                  {service.images.length > 1 && (
                    <div className="image-overlay">
                      +{service.images.length - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="no-image">
                  <span>📸 No image available</span>
                </div>
              )}

              {/* Status Badge */}
              <div className={`status-badge ${service.status}`}>
                {service.status}
              </div>
            </div>

            <div className="service-card-content">
              {/* Header with Title and Rating */}
              <div className="service-card-header">
                <h2>{service.title}</h2>
                {service.rating > 0 && (
                  <div className="rating">
                    <span className="star-icon">★</span>
                    <span>{service.rating}</span>
                  </div>
                )}
              </div>

              {/* Freelancer Info */}
              {service.freelancer && (
                <div className="freelancer-mini">
                  <div className="freelancer-mini-avatar">
                    {service.freelancer.name?.charAt(0) || "F"}
                  </div>
                  <div className="freelancer-mini-info">
                    <div className="freelancer-mini-name">
                      {service.freelancer.name}
                    </div>
                    <div className="freelancer-mini-stats">
                      <span>★ {service.freelancer.rating || "New"}</span>
                      <span>•</span>
                      <span>
                        {service.freelancer.totalReviews || 0} reviews
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="service-description">{service.description}</p>

              {/* Stats */}
              <div className="service-stats">
                <div className="stat-item">
                  <span className="stat-icon">📦</span>
                  <span>{service.totalOrders || 0} orders</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">⭐</span>
                  <span>{service.rating || "No ratings"}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="service-categories">
                <span className="category-pill">{service.category}</span>
                {service.freelancer?.skills?.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className="category-pill">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer with Price and Delivery */}
              <div className="service-footer">
                <div className="price-container">
                  <span className="price-label">Starting at</span>
                  <span className="price-value">
                    ${service.price} <small>USD</small>
                  </span>
                </div>
                <div className="delivery-badge">
                  <span>⏱️</span>
                  <span>{service.deliveryTime} days</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
