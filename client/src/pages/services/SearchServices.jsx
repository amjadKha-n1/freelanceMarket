import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../../api/axios";
import "../styles/services.css";

const SearchServices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "newest",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  const query = searchParams.get("q") || "";

  useEffect(() => {
    fetchSearchResults();
  }, [searchParams, filters, pagination.currentPage]);

  const fetchSearchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        page: pagination.currentPage,
        limit: 12,
        ...filters,
      });

      const { data } = await API.get(`/services/search?${params}`);
      setServices(data.services);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        total: data.total,
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    window.scrollTo(0, 0);
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h2 style={{ color: "black", fontSize: "2.5rem" }}>
          🔍 Search Results
        </h2>
        <p className="search-query">
          {query ? `Showing results for: "${query}"` : "Browse all services"}
          <span className="result-count">
            {" "}
            ({pagination.total} results found)
          </span>
        </p>
      </div>

      <div className="search-container">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="filter-group">
            <h3>📂 Category</h3>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Web Development">💻 Web Development</option>
              <option value="Design">🎨 Design</option>
              <option value="Writing">✍️ Writing</option>
              <option value="Marketing">📈 Marketing</option>
              <option value="Video">🎬 Video</option>
              <option value="AI development">🤖 AI Development</option>
            </select>
          </div>

          <div className="filter-group">
            <h3>💰 Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min $"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max $"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <h3>📊 Sort By</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="newest">✨ Newest First</option>
              <option value="price_asc">💰 Price: Low to High</option>
              <option value="price_desc">💰 Price: High to Low</option>
              <option value="rating">⭐ Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Results Grid - Beautiful Cards */}
        <div className="search-results">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Finding the best services for you...</p>
            </div>
          ) : services.length > 0 ? (
            <>
              <div className="services-grid">
                {services.map((service) => (
                  <Link
                    to={`/services/${service._id}`}
                    key={service._id}
                    className="service-card-link"
                  >
                    <div className="service-card">
                      {/* Image Section */}
                      <div className="service-images">
                        {service.images && service.images.length > 0 ? (
                          <div className="image-gallery">
                            <img
                              src={service.images[0]}
                              alt={service.title}
                              className="main-image"
                            />
                          </div>
                        ) : (
                          <div className="no-image">
                            <span>📸</span>
                          </div>
                        )}
                        <div className="status-badge approved">✓ Available</div>
                        {service.images && service.images.length > 1 && (
                          <div className="image-overlay">
                            📷 +{service.images.length}
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="service-card-content">
                        <div className="service-card-header">
                          <h2>{service.title}</h2>
                          <div className="rating">
                            <span className="star-icon">⭐</span>
                            <span>{service.rating || "5.0"}</span>
                          </div>
                        </div>

                        {/* Freelancer Info */}
                        <div className="freelancer-mini">
                          <div className="freelancer-mini-avatar">
                            {service.freelancer?.name?.charAt(0)}
                          </div>
                          <div className="freelancer-mini-info">
                            <div className="freelancer-mini-name">
                              {service.freelancer?.name}
                            </div>
                            <div className="freelancer-mini-stats">
                              <span>
                                ⭐ {service.freelancer?.rating || "5.0"}
                              </span>
                              <span>
                                📝 {service.freelancer?.totalReviews || 0}{" "}
                                reviews
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="service-description">
                          {truncateText(service.description, 120)}
                        </p>

                        {/* Categories/Skills */}
                        <div className="service-categories">
                          <span className="category-pill">
                            {service.category}
                          </span>
                          {service.skills?.slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="category-pill">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="service-stats">
                          <div className="stat-item">
                            <span className="stat-icon">📦</span>
                            <span>{service.totalOrders || 0} orders</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-icon">⏱️</span>
                            <span>{service.deliveryTime} days</span>
                          </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="service-footer">
                          <div className="price-container">
                            <span className="price-label">Starting from</span>
                            <div className="price-value">
                              ${service.price}
                              <small>/project</small>
                            </div>
                          </div>
                          <div className="delivery-badge">
                            <span>🚀</span>
                            <span>Order Now</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    ← Previous
                  </button>
                  <span className="page-info">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No services found</h3>
              <p>We couldn't find any services matching your criteria.</p>
              <p>Try adjusting your filters or search terms.</p>
              <Link to="/services" className="browse-btn">
                Browse All Services
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchServices;
