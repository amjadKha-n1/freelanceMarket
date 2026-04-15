import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import "../styles/dashboard.css";

const FreelancerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    monthly: [],
  });
  const [reviews, setReviews] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState({
    services: true,
    orders: true,
    earnings: true,
    reviews: true,
    conversations: true,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    averageRating: 0,
    totalReviews: 0,
    activeServices: 0,
    pendingServices: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const servicesRes = await API.get("/services/my-services");
      setServices(servicesRes.data.services);
      setLoading((prev) => ({ ...prev, services: false }));

      const ordersRes = await API.get("/orders/freelancer-orders");
      setOrders(ordersRes.data.orders);
      setLoading((prev) => ({ ...prev, orders: false }));

      const earningsRes = await API.get("/orders/earnings");
      setEarnings(earningsRes.data);
      setLoading((prev) => ({ ...prev, earnings: false }));

      const reviewsRes = await API.get("/reviews/freelancer");
      setReviews(reviewsRes.data.reviews);
      setLoading((prev) => ({ ...prev, reviews: false }));

      const conversationsRes = await API.get("/messages/my-conversations");
      setConversations(conversationsRes.data.conversations);
      setLoading((prev) => ({ ...prev, conversations: false }));

      calculateStats(
        servicesRes.data.services,
        ordersRes.data.orders,
        reviewsRes.data.reviews
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const calculateStats = (services, orders, reviews) => {
    const serviceStats = {
      activeServices: services.filter((s) => s.status === "approved").length,
      pendingServices: services.filter((s) => s.status === "pending").length,
      rejectedServices: services.filter((s) => s.status === "rejected").length,
    };

    const orderStats = {
      totalOrders: orders.length,
      completedOrders: orders.filter((o) => o.status === "completed").length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      inProgressOrders: orders.filter((o) => o.status === "in-progress").length,
      deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
    };

    const reviewStats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (
              reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0,
    };

    setStats({
      ...serviceStats,
      ...orderStats,
      ...reviewStats,
    });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      const ordersRes = await API.get("/orders/freelancer-orders");
      setOrders(ordersRes.data.orders);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await API.delete(`/services/${serviceId}`);
        setServices(services.filter((s) => s._id !== serviceId));
      } catch (error) {
        console.error("Error deleting service:", error);
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

  const getOtherParticipant = (conversation) => {
    return conversation.members?.find((m) => m._id !== user?._id);
  };

  const tabs = [
    { id: "overview", label: "📊 Overview", icon: "📊" },
    { id: "services", label: "📋 My Services", icon: "📋" },
    { id: "orders", label: "📦 Orders", icon: "📦" },
    { id: "earnings", label: "💰 Earnings", icon: "💰" },
    { id: "reviews", label: "⭐ Reviews", icon: "⭐" },
    { id: "messages", label: "💬 Messages", icon: "💬" },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Welcome back, {user?.name}! 👋</h1>
            <p className="dashboard-subtitle">
              Here's what's happening with your freelance business
            </p>
          </div>
          <div className="header-right">
            <Link to="/create-service" className="create-service-btn">
              <span className="btn-icon">➕</span>
              Create New Service
            </Link>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <span className="stat-value">{stats.activeServices}</span>
              <span className="stat-label">Active Services</span>
              {stats.pendingServices > 0 && (
                <span className="stat-badge">
                  {stats.pendingServices} pending
                </span>
              )}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-value">{stats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
              {stats.inProgressOrders > 0 && (
                <span className="stat-badge">
                  {stats.inProgressOrders} in progress
                </span>
              )}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-value">${earnings.totalEarnings || 0}</span>
              <span className="stat-label">Total Earnings</span>
              <span className="stat-badge">
                ${earnings.pendingEarnings || 0} pending
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <span className="stat-value">{stats.averageRating}</span>
              <span className="stat-label">Average Rating</span>
              <span className="stat-badge">{stats.totalReviews} reviews</span>
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
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="recent-order-item">
                      <div className="order-info">
                        <h4>{order.service?.title}</h4>
                        <p className="client-name">
                          Client: {order.client?.name}
                        </p>
                      </div>
                      <div className="order-meta">
                        <span className={`order-status ${order.status}`}>
                          {order.status}
                        </span>
                        <span className="order-price">${order.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Recent Reviews</h2>
                  <button
                    className="view-all-btn"
                    onClick={() => setActiveTab("reviews")}
                  >
                    View All →
                  </button>
                </div>
                <div className="recent-reviews">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <span className="review-rating">
                          {"⭐".repeat(review.rating)}
                        </span>
                        <span className="review-client">
                          {review.client?.name}
                        </span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Messages - FIXED */}
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
                  {loading.conversations ? (
                    <div className="loading-spinner">Loading...</div>
                  ) : conversations.length > 0 ? (
                    conversations.slice(0, 3).map((conv) => {
                      const otherParticipant = getOtherParticipant(conv);
                      return (
                        <div key={conv._id} className="message-preview">
                          <div className="message-avatar">
                            {otherParticipant?.name?.charAt(0)}
                          </div>
                          <div className="message-info">
                            <h4>{otherParticipant?.name}</h4>
                            <p className="message-text">
                              {conv.lastMessage || "No messages yet"}
                            </p>
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

          {/* Services Tab - No changes needed */}
          {activeTab === "services" && (
            <div className="services-tab">
              <div className="services-header">
                <h2>My Services</h2>
                <Link
                  to="/services/create-service"
                  className="create-service-btn"
                >
                  <span className="btn-icon">➕</span>
                  Create New Service
                </Link>
              </div>

              {loading.services ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="services-grid">
                  {services.map((service) => (
                    <div key={service._id} className="service-card">
                      <div className="service-image">
                        {service.images?.[0] ? (
                          <img src={service.images[0]} alt={service.title} />
                        ) : (
                          <div className="no-image">📸 No image</div>
                        )}
                        <div className={`service-status ${service.status}`}>
                          {service.status}
                        </div>
                      </div>
                      <div className="service-content">
                        <h3>{service.title}</h3>
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
                            View
                          </Link>
                          <Link
                            to={`/services/${service._id}/edit`}
                            className="edit-btn"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab - Added Message Button */}
          {activeTab === "orders" && (
            <div className="orders-tab">
              <h2>Manage Orders</h2>

              <div className="order-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Pending</button>
                <button className="filter-btn">In Progress</button>
                <button className="filter-btn">Delivered</button>
                <button className="filter-btn">Completed</button>
              </div>

              {loading.orders ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
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
                            <span className="info-label">Client</span>
                            <span className="info-value">
                              {order.client?.name}
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
                              {new Date(order.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="info-item">
                            <span className="info-label">Ordered</span>
                            <span className="info-value">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="order-actions">
                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order._id, "in-progress")
                              }
                              className="action-btn start"
                            >
                              Start Order
                            </button>
                          )}
                          {order.status === "in-progress" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order._id, "delivered")
                                }
                                className="action-btn deliver"
                              >
                                Mark as Delivered
                              </button>
                              <input
                                type="file"
                                id={`file-${order._id}`}
                                className="file-input"
                              />
                              <label
                                htmlFor={`file-${order._id}`}
                                className="file-btn"
                              >
                                Upload File
                              </label>
                            </>
                          )}
                          {order.status === "delivered" && (
                            <span className="waiting-review">
                              Waiting for client review
                            </span>
                          )}
                          {/* ADDED: Message Client Button */}
                          <button
                            onClick={() => handleMessageClick(order._id)}
                            className="action-btn deliver"
                          >
                            💬 Message Client
                          </button>
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
              )}
            </div>
          )}

          {/* Earnings Tab - No changes needed */}
          {activeTab === "earnings" && (
            <div className="earnings-tab">
              <div className="earnings-header">
                <h2>Earnings Overview</h2>
                <div className="date-range-selector">
                  <button className="range-btn">Month</button>
                  <button className="range-btn active">Year</button>
                  <button className="range-btn">All Time</button>
                </div>
              </div>

              <div className="earnings-summary">
                <div className="summary-card total">
                  <div className="summary-icon">💰</div>
                  <div className="summary-content">
                    <span className="summary-label">Total Earnings</span>
                    <span className="summary-value">
                      ${earnings.totalEarnings || 0}
                    </span>
                    <span className="summary-trend up">↑ 12.5%</span>
                  </div>
                </div>
                <div className="summary-card pending">
                  <div className="summary-icon">⏳</div>
                  <div className="summary-content">
                    <span className="summary-label">Pending</span>
                    <span className="summary-value">
                      ${earnings.pendingEarnings || 0}
                    </span>
                    <span className="summary-trend">Awaiting clearance</span>
                  </div>
                </div>
                <div className="summary-card completed">
                  <div className="summary-icon">✅</div>
                  <div className="summary-content">
                    <span className="summary-label">
                      Available for Withdrawal
                    </span>
                    <span className="summary-value">
                      ${earnings.availableEarnings || 0}
                    </span>
                    <button className="withdraw-btn">Withdraw Now</button>
                  </div>
                </div>
              </div>

              <div className="earnings-chart">
                <div className="chart-header">
                  <h3>Monthly Earnings</h3>
                  <div className="chart-legend">
                    <span className="legend-dot earnings"></span>
                    <span>Earnings</span>
                  </div>
                </div>
                <div className="chart-container">
                  {earnings.monthly?.map((month, index) => (
                    <div key={index} className="chart-bar-wrapper">
                      <div
                        className="chart-bar"
                        style={{
                          height: `${Math.min(month.amount / 10, 150)}px`,
                        }}
                      >
                        <span className="bar-tooltip">${month.amount}</span>
                      </div>
                      <span className="bar-label">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="recent-transactions">
                <div className="transactions-header">
                  <h3>Recent Transactions</h3>
                  <button className="view-all-btn">View All →</button>
                </div>

                <div className="transactions-table-container">
                  <table className="transactions-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Date</th>
                        <th>Order</th>
                        <th>Client</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter((o) => o.status === "completed")
                        .slice(0, 5)
                        .map((order) => (
                          <tr key={order._id}>
                            <td className="transaction-id">
                              #{order._id.slice(-8)}
                            </td>
                            <td className="transaction-date">
                              {new Date(order.updatedAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="transaction-order">
                              {order.service?.title}
                            </td>
                            <td className="transaction-client">
                              <div className="client-info">
                                <span className="client-avatar">
                                  {order.client?.name?.charAt(0)}
                                </span>
                                <span>{order.client?.name}</span>
                              </div>
                            </td>
                            <td className="transaction-amount">
                              ${order.price}
                            </td>
                            <td>
                              <span className="transaction-status completed">
                                <span className="status-dot"></span>
                                Paid
                              </span>
                            </td>
                            <td>
                              <button
                                className="view-order-btn"
                                onClick={() => navigate(`/orders/${order._id}`)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      {orders.filter((o) => o.status === "completed").length ===
                        0 && (
                        <tr>
                          <td colSpan="7" className="no-data-cell">
                            <div className="no-transactions">
                              <span className="no-data-icon">💰</span>
                              <p>No transactions yet</p>
                              <span className="no-data-sub">
                                Complete orders to see your earnings
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="withdrawal-history">
                <div className="withdrawal-header">
                  <h3>Withdrawal History</h3>
                  <button className="withdraw-btn-secondary">
                    Request Withdrawal
                  </button>
                </div>
                <div className="withdrawal-list">
                  <div className="withdrawal-item">
                    <div className="withdrawal-info">
                      <span className="withdrawal-amount">$500.00</span>
                      <span className="withdrawal-date">March 15, 2026</span>
                    </div>
                    <div className="withdrawal-status completed">
                      <span className="status-dot"></span>
                      Completed
                    </div>
                  </div>
                  <div className="withdrawal-item">
                    <div className="withdrawal-info">
                      <span className="withdrawal-amount">$250.00</span>
                      <span className="withdrawal-date">March 1, 2026</span>
                    </div>
                    <div className="withdrawal-status processing">
                      <span className="status-dot"></span>
                      Processing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab - No changes needed */}
          {activeTab === "reviews" && (
            <div className="reviews-tab">
              <h2>Client Reviews</h2>

              <div className="reviews-summary">
                <div className="rating-overview">
                  <span className="rating-number">{stats.averageRating}</span>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`star ${
                          star <= stats.averageRating ? "filled" : ""
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="total-reviews">
                    {stats.totalReviews} reviews
                  </span>
                </div>
              </div>

              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <div className="reviewer-info">
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
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-service">
                      Service: {review.service?.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages Tab - FIXED */}
          {activeTab === "messages" && (
            <div className="messages-tab">
              <h2>Messages</h2>

              {loading.conversations ? (
                <div className="loading-spinner">Loading...</div>
              ) : conversations.length > 0 ? (
                <div className="conversations-list">
                  {conversations.map((conv) => {
                    const otherParticipant = getOtherParticipant(conv);
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
                    When clients message you, they'll appear here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
