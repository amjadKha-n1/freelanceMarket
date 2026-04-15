import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import "../styles/dashboard.css";

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState({
    orders: true,
    favorites: true,
    messages: true,
    reviews: true,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    favoriteCount: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    if (user && user.role !== "client") {
      if (user.role === "freelancer") {
        navigate("/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "client") {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const ordersRes = await API.get("/orders/my-orders");
      setOrders(ordersRes.data.orders);
      setLoading((prev) => ({ ...prev, orders: false }));

      const messagesRes = await API.get("/messages/my-conversations");
      setMessages(messagesRes.data.conversations);
      setLoading((prev) => ({ ...prev, messages: false }));

      const reviewsRes = await API.get("/reviews/client");
      setReviews(reviewsRes.data.reviews);
      setLoading((prev) => ({ ...prev, reviews: false }));

      calculateStats(ordersRes.data.orders);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const calculateStats = (orders) => {
    const totalSpent = orders.reduce((acc, order) => acc + order.price, 0);

    setStats({
      totalOrders: orders.length,
      activeOrders: orders.filter((o) =>
        ["pending", "in-progress"].includes(o.status)
      ).length,
      completedOrders: orders.filter((o) => o.status === "completed").length,
      totalSpent: totalSpent,
      favoriteCount: favoriteServices.length,
      unreadMessages: 0,
    });
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await API.put(`/orders/${orderId}/status`, { status: "cancelled" });

        const ordersRes = await API.get("/orders/my-orders");
        setOrders(ordersRes.data.orders);
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    }
  };
  const handleMessageClick = async (orderId) => {
    try {
      const { data } = await API.post("/messages/start-conversation", {
        orderId,
      });

      navigate(`/messages/${data.conversation._id}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert("Could not start conversation. Please try again.");
    }
  };
  const handleCompleteOrder = async (orderId) => {
    if (window.confirm("Mark this order as completed?")) {
      try {
        await API.put(`/orders/${orderId}/client-status`, {
          status: "completed",
        });

        const ordersRes = await API.get("/orders/my-orders");
        setOrders(ordersRes.data.orders);
      } catch (error) {
        console.error("Error completing order:", error);
        alert(error.response?.data?.message || "Failed to complete order");
      }
    }
  };

  const handleRemoveFavorite = async (serviceId) => {
    try {
      await API.delete(`/favorites/${serviceId}`);
      setFavoriteServices(favoriteServices.filter((s) => s._id !== serviceId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "📊 Overview", icon: "📊" },
    { id: "orders", label: "📦 My Orders", icon: "📦" },
    { id: "favorites", label: "❤️ Favorites", icon: "❤️" },
    { id: "messages", label: "💬 Messages", icon: "💬" },
    { id: "reviews", label: "⭐ My Reviews", icon: "⭐" },
  ];

  if (!user || user.role !== "client") {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">
              Here's what's happening with your projects
            </p>
          </div>
          <div className="header-right">
            <Link to="/services" className="create-service-btn">
              <span className="btn-icon">🔍</span>
              Browse Services
            </Link>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
              {stats.activeOrders > 0 && (
                <span className="stat-badge">{stats.activeOrders} active</span>
              )}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-value">${stats.totalSpent}</span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <span className="stat-value">{stats.favoriteCount}</span>
              <span className="stat-label">Favorites</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-content">
              <span className="stat-value">{stats.unreadMessages}</span>
              <span className="stat-label">Unread Messages</span>
              {stats.unreadMessages > 0 && (
                <span className="stat-badge">new</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ color: "white" }} className="tab-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="overview-tab">
              {/* Recent Orders */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Recent Orders</h2>
                  <button
                    className="view-all-btn"
                    onClick={() => setActiveTab("orders")}
                  >
                    View All →
                  </button>
                </div>
                <div className="recent-orders">
                  {loading.orders ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : orders.length > 0 ? (
                    orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="recent-order-item">
                        <div className="order-info">
                          <h4>{order.service?.title}</h4>
                          <p className="client-name">
                            Freelancer: {order.freelancer?.name}
                          </p>
                        </div>
                        <div className="order-meta">
                          <span className={`order-status ${order.status}`}>
                            {order.status}
                          </span>
                          <span className="order-price">${order.price}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No orders yet</p>
                  )}
                </div>
              </div>

              {/* Favorite Services */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Favorite Services</h2>
                  <button
                    className="view-all-btn"
                    onClick={() => setActiveTab("favorites")}
                  >
                    View All →
                  </button>
                </div>
                <div className="favorite-services">
                  {loading.favorites ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : favoriteServices.length > 0 ? (
                    favoriteServices.slice(0, 3).map((service) => (
                      <div key={service._id} className="favorite-item">
                        <div className="favorite-info">
                          <h4>{service.title}</h4>
                          <p className="freelancer-name">
                            By: {service.freelancer?.name}
                          </p>
                        </div>
                        <div className="favorite-meta">
                          <span className="service-price">
                            ${service.price}
                          </span>
                          <Link
                            to={`/services/${service._id}`}
                            className="view-link"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No favorites yet</p>
                  )}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Recent Messages</h2>
                  <button
                    className="view-all-btn"
                    onClick={() => setActiveTab("messages")}
                  >
                    View All →
                  </button>
                </div>
                <div className="recent-messages">
                  {loading.messages ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : messages.length > 0 ? (
                    messages.slice(0, 3).map((conv) => {
                      const otherParticipant = conv.members?.find(
                        (m) => m._id !== user?._id
                      );
                      return (
                        <div key={conv._id} className="message-preview">
                          <div className="message-avatar">
                            {otherParticipant?.avatar ? (
                              <img
                                src={otherParticipant.avatar}
                                alt={otherParticipant.name}
                              />
                            ) : (
                              <span>{otherParticipant?.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div className="message-info">
                            <h4>{otherParticipant?.name}</h4>
                            <p className="message-text">
                              {conv.lastMessage || "No messages yet"}
                            </p>
                            <span className="message-time-small">
                              {new Date(conv.updatedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-data">No messages yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="orders-tab">
              <h2>My Orders</h2>

              {/* Order Filters */}
              <div className="order-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Pending</button>
                <button className="filter-btn">In Progress</button>
                <button className="filter-btn">Delivered</button>
                <button className="filter-btn">Completed</button>
              </div>

              {loading.orders ? (
                <div className="loading-spinner">Loading...</div>
              ) : orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <h3>{order.service?.title}</h3>
                        <span className={`order-status ${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-details">
                        <div className="order-info-grid">
                          <div className="info-item">
                            <span className="info-label">Freelancer</span>
                            <span className="info-value">
                              {order.freelancer?.name}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Price</span>
                            <span className="info-value price">
                              ${order.price}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Deadline</span>
                            <span className="info-value">
                              {order.deadline
                                ? new Date(order.deadline).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Ordered</span>
                            <span className="info-value">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Order Actions */}
                        <div className="order-actions">
                          {order.status === "delivered" && (
                            <>
                              <button
                                onClick={() => handleCompleteOrder(order._id)}
                                className="action-btn start"
                              >
                                ✓ Accept & Complete
                              </button>
                            </>
                          )}
                          {order.status === "completed" && (
                            <>
                              <Link
                                to={`/review/${order._id}/${order.service?._id}`}
                                className="action-btn deliver"
                              >
                                ⭐ Leave Review
                              </Link>
                            </>
                          )}
                          {(order.status === "pending" ||
                            order.status === "in-progress") && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="action-btn"
                              style={{
                                background: "var(--danger-color)",
                                color: "white",
                              }}
                            >
                              ✕ Cancel Order
                            </button>
                          )}
                          <button
                            onClick={() => handleMessageClick(order._id)}
                            className="action-btn deliver"
                          >
                            💬 Message Seller
                          </button>
                          {order.deliveryFile && (
                            <a
                              href={order.deliveryFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="file-btn"
                            >
                              📎 Download File
                            </a>
                          )}
                          <Link
                            to={`/orders/${order._id}`}
                            className="details-link"
                          >
                            View Details →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-container">
                  <p className="no-data">You haven't placed any orders yet</p>
                  <Link to="/services" className="create-service-btn">
                    Browse Services
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <div className="favorites-tab">
              <h2>Favorite Services</h2>

              {loading.favorites ? (
                <div className="loading-spinner">Loading...</div>
              ) : favoriteServices.length > 0 ? (
                <div className="services-grid">
                  {favoriteServices.map((service) => (
                    <div key={service._id} className="service-card">
                      <div className="service-image">
                        {service.images?.[0] ? (
                          <img src={service.images[0]} alt={service.title} />
                        ) : (
                          <div className="no-image">📸 No image</div>
                        )}
                        <button
                          className="favorite-remove"
                          onClick={() => handleRemoveFavorite(service._id)}
                        >
                          ❤️
                        </button>
                      </div>
                      <div className="service-content">
                        <h3>{service.title}</h3>
                        <p className="freelancer-name">
                          By: {service.freelancer?.name}
                        </p>
                        <p className="service-description">
                          {service.description}
                        </p>
                        <div className="service-meta">
                          <span className="service-price">
                            ${service.price}
                          </span>
                          <span className="service-delivery">
                            ⏱️ {service.deliveryTime} days
                          </span>
                        </div>
                        <div className="service-stats">
                          <span>⭐ {service.rating || "0"}</span>
                          <span>📦 {service.totalOrders || 0} orders</span>
                        </div>
                        <div className="service-actions">
                          <Link
                            to={`/services/${service._id}`}
                            className="view-btn"
                          >
                            View Details
                          </Link>
                          <Link
                            to={`/order/${service._id}`}
                            className="edit-btn"
                          >
                            Order Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-container">
                  <p className="no-data">You haven't saved any favorites yet</p>
                  <Link to="/services" className="create-service-btn">
                    Browse Services
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="messages-tab">
              <h2>Messages</h2>

              {loading.messages ? (
                <div className="loading-spinner">Loading...</div>
              ) : messages.length > 0 ? (
                <div className="conversations-list">
                  {messages.map((conv) => {
                    const otherParticipant = conv.members?.find(
                      (m) => m._id !== user?._id
                    );
                    return (
                      <div key={conv._id} className="conversation-item">
                        <div className="conversation-avatar">
                          {otherParticipant?.avatar ? (
                            <img
                              src={otherParticipant.avatar}
                              alt={otherParticipant.name}
                            />
                          ) : (
                            <span>{otherParticipant?.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div className="conversation-info">
                          <h4>{otherParticipant?.name}</h4>
                          <p className="last-message">
                            {conv.lastMessage || "No messages yet"}
                          </p>
                          <span className="message-time">
                            {new Date(conv.updatedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <Link
                          to={`/messages/${conv._id}`}
                          className="message-link"
                        >
                          View Chat →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-data-container">
                  <p className="no-data">No messages yet</p>
                  <p className="no-data-sub">
                    When you have orders, you can message freelancers here
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="reviews-tab">
              <h2>My Reviews</h2>

              <div className="reviews-summary">
                <div className="rating-overview">
                  <span className="rating-number">
                    {reviews.length > 0
                      ? (
                          reviews.reduce((acc, r) => acc + r.rating, 0) /
                          reviews.length
                        ).toFixed(1)
                      : "0"}
                  </span>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="star">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="total-reviews">
                    {reviews.length} reviews given
                  </span>
                </div>
              </div>

              {loading.reviews ? (
                <div className="loading-spinner">Loading...</div>
              ) : reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-item">
                      <div className="review-header">
                        <div className="reviewer-info">
                          <span className="reviewer-name">
                            {review.service?.title}
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
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <div className="review-service">
                        Freelancer: {review.freelancer?.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">You haven't written any reviews yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
