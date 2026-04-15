import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import "../styles/dashboard.css";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    totalServices: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    reportedItems: 0,
  });
  const [platformEarnings, setPlatformEarnings] = useState([]);

  const [loading, setLoading] = useState({
    users: true,
    services: true,
    orders: true,
    stats: true,
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("week");

  useEffect(() => {
    if (user && user.role !== "admin") {
      if (user.role === "freelancer") {
        navigate("/freelancer-dashboard");
      } else if (user.role === "client") {
        navigate("/client-dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchDashboardData();
    }
  }, [user, dateRange]);

  const fetchDashboardData = async () => {
    try {
      const usersRes = await API.get("/admin/users");
      setUsers(usersRes.data.users);
      setLoading((prev) => ({ ...prev, users: false }));

      const servicesRes = await API.get("/admin/services");
      setServices(servicesRes.data.services);

      const pending = servicesRes.data.services.filter(
        (s) => s.status === "pending"
      );
      setPendingServices(pending);
      setLoading((prev) => ({ ...prev, services: false }));

      const ordersRes = await API.get("/admin/orders");
      setOrders(ordersRes.data.orders);
      setLoading((prev) => ({ ...prev, orders: false }));

      const statsRes = await API.get("/admin/stats");
      console.log("stats data", statsRes.data);
      setPlatformStats(statsRes.data);

      const earningRes = await API.get("/admin/admin-earnings");
      setPlatformEarnings(earningRes.data);

      setLoading((prev) => ({ ...prev, stats: false }));
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    }
  };

  const handleApproveService = async (serviceId) => {
    try {
      await API.put(`/admin/services/${serviceId}/approve`);

      const servicesRes = await API.get("/admin/services");
      setServices(servicesRes.data.services);
      setPendingServices(
        servicesRes.data.services.filter((s) => s.status === "pending")
      );
    } catch (error) {
      console.error("Error approving service:", error);
    }
  };

  const handleRejectService = async (serviceId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (reason) {
      try {
        await API.put(`/admin/services/${serviceId}/reject`, { reason });

        const servicesRes = await API.get("/admin/services");
        setServices(servicesRes.data.services);
        setPendingServices(
          servicesRes.data.services.filter((s) => s.status === "pending")
        );
      } catch (error) {
        console.error("Error rejecting service:", error);
      }
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (window.confirm(`Change user role to ${newRole}?`)) {
      try {
        await API.post(`/admin/${userId}`, { role: newRole });

        const usersRes = await API.get("/admin/users");
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error("Error updating user role:", error);
      }
    }
  };

  const handleSuspendUser = async (userId) => {
    if (window.confirm("Are you sure you want to suspend this user?")) {
      try {
        await API.put(`/admin/users/${userId}/suspend`);

        const usersRes = await API.get("/admin/users");
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error("Error suspending user:", error);
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this service? This action cannot be undone."
      )
    ) {
      try {
        await API.delete(`/admin/services/${serviceId}`);

        const servicesRes = await API.get("/admin/services");
        setServices(servicesRes.data.services);
        setPendingServices(
          servicesRes.data.services.filter((s) => s.status === "pending")
        );
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const handleResolveReport = async (reportId) => {
    try {
      await API.put(`/admin/reports/${reportId}/resolve`);
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "📊 Platform Overview", icon: "📊" },
    { id: "users", label: "👥 User Management", icon: "👥" },
    { id: "services", label: "📋 Service Management", icon: "📋" },
    {
      id: "pending",
      label: `⏳ Pending Approvals (${pendingServices.length})`,
      icon: "⏳",
    },
    { id: "orders", label: "📦 Order Management", icon: "📦" },
    { id: "analytics", label: "📈 Analytics", icon: "📈" },
    { id: "reports", label: "🚩 Reports", icon: "🚩" },
  ];

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Admin Dashboard 👑</h1>
            <p className="dashboard-subtitle">
              Manage your platform, users, services, and more
            </p>
          </div>
          <div className="header-right">
            <div className="date-range-selector">
              <button
                className={`range-btn ${dateRange === "day" ? "active" : ""}`}
                onClick={() => setDateRange("day")}
              >
                Today
              </button>
              <button
                className={`range-btn ${dateRange === "week" ? "active" : ""}`}
                onClick={() => setDateRange("week")}
              >
                This Week
              </button>
              <button
                className={`range-btn ${dateRange === "month" ? "active" : ""}`}
                onClick={() => setDateRange("month")}
              >
                This Month
              </button>
              <button
                className={`range-btn ${dateRange === "year" ? "active" : ""}`}
                onClick={() => setDateRange("year")}
              >
                This Year
              </button>
            </div>
          </div>
        </div>

        {/* Platform Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <span className="stat-value">{platformStats.totalUsers}</span>
              <span className="stat-label">Total Users</span>
              <div className="stat-breakdown">
                <span className="badge freelancer">
                  F: {platformStats.totalFreelancers}
                </span>
                <span className="badge client">
                  C: {platformStats.totalClients}
                </span>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <span className="stat-value">{platformStats.totalServices}</span>
              <span className="stat-label">Total Services</span>
              {platformStats.pendingApprovals > 0 && (
                <span className="stat-badge warning">
                  {platformStats.pendingApprovals} pending
                </span>
              )}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <span className="stat-value">{platformStats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          {/* <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-content">
                            <span className="stat-value">${platformStats.totalRevenue}</span>
                            <span className="stat-label">Total Revenue</span>
                        </div>
                    </div> */}
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <span className="stat-value">
                ${platformEarnings.totalPlatformRevenue}
              </span>
              <span className="stat-label">Platform Revenue</span>
              <span className="stat-badge">
                ${platformEarnings.pendingPayouts} pending
              </span>
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
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="overview-tab">
              {/* Recent Activities */}
              <div className="dashboard-section full-width">
                <div className="section-header">
                  <h2>Recent Activities</h2>
                  <button className="view-all-btn">Refresh</button>
                </div>
                <div className="activities-list">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-icon">
                        {activity.type === "user" && "👤"}
                        {activity.type === "service" && "📋"}
                        {activity.type === "order" && "📦"}
                        {activity.type === "review" && "⭐"}
                      </span>
                      <div className="activity-content">
                        <p className="activity-text">{activity.text}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>Quick Actions</h2>
                </div>
                <div className="quick-actions-grid">
                  <button
                    className="quick-action-btn"
                    onClick={() => setActiveTab("pending")}
                  >
                    <span className="action-icon">⏳</span>
                    <span>Review Pending Services</span>
                    {platformStats.pendingApprovals > 0 && (
                      <span className="action-badge">
                        {platformStats.pendingApprovals}
                      </span>
                    )}
                  </button>
                  <button
                    className="quick-action-btn"
                    onClick={() => setActiveTab("users")}
                  >
                    <span className="action-icon">👥</span>
                    <span>Manage Users</span>
                  </button>
                  <button
                    className="quick-action-btn"
                    onClick={() => setActiveTab("services")}
                  >
                    <span className="action-icon">📋</span>
                    <span>Manage Services</span>
                  </button>
                  <button
                    className="quick-action-btn"
                    onClick={() => setActiveTab("reports")}
                  >
                    <span className="action-icon">🚩</span>
                    <span>View Reports</span>
                  </button>
                </div>
              </div>

              {/* System Health */}
              <div style={{ color: "white" }} className="dashboard-section">
                <div className="section-header">
                  <h2>System Health</h2>
                </div>
                <div className="system-health">
                  <div className="health-item">
                    <span className="health-label">Server Status</span>
                    <span className="health-value healthy">● Online</span>
                  </div>
                  <div className="health-item">
                    <span className="health-label">API Response Time</span>
                    <span className="health-value">124ms</span>
                  </div>
                  <div className="health-item">
                    <span className="health-label">Active Users</span>
                    <span className="health-value">2.3k</span>
                  </div>
                  <div className="health-item">
                    <span className="health-label">Storage Used</span>
                    <span className="health-value">45%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <div className="users-tab">
              <div className="tab-header">
                <h2>User Management</h2>
                <div className="header-actions">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="search-input"
                  />
                  <select className="filter-select">
                    <option>All Roles</option>
                    <option>Freelancers</option>
                    <option>Clients</option>
                    <option>Admins</option>
                  </select>
                </div>
              </div>

              {loading.users ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="users-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar-small">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} />
                                ) : (
                                  <span>{user.name?.charAt(0)}</span>
                                )}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleUpdateUserRole(user._id, e.target.value)
                              }
                              className={`role-select ${user.role}`}
                            >
                              <option value="client">Client</option>
                              <option value="freelancer">Freelancer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td>{user.suspended ? "Suspended" : "Active"}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="icon-btn view"
                                onClick={() =>
                                  navigate(`/admin/users/${user._id}`)
                                }
                              >
                                👁️
                              </button>
                              <button
                                className="icon-btn suspend"
                                onClick={() => handleSuspendUser(user._id)}
                              >
                                {user.suspended ? "🔓" : "🔒"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Pending Approvals Tab */}
          {activeTab === "pending" && (
            <div className="pending-tab">
              <h2 style={{ color: "white" }}>Pending Service Approvals</h2>

              {pendingServices.length > 0 ? (
                <div className="pending-services-list">
                  {pendingServices.map((service) => (
                    <div key={service._id} className="pending-service-card">
                      <div className="pending-service-header">
                        <h3>{service.title}</h3>
                        <span className="service-category">
                          {service.category}
                        </span>
                      </div>
                      <div className="pending-service-content">
                        <div className="service-info">
                          <p>
                            <strong>Freelancer:</strong>{" "}
                            {service.freelancer?.name}
                          </p>
                          <p>
                            <strong>Price:</strong> ${service.price}
                          </p>
                          <p>
                            <strong>Delivery:</strong> {service.deliveryTime}{" "}
                            days
                          </p>
                          <p>
                            <strong>Submitted:</strong>{" "}
                            {new Date(service.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="service-description">
                          <p>{service.description}</p>
                        </div>
                        {service.images && service.images.length > 0 && (
                          <div className="service-images-small">
                            {service.images.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Preview ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="pending-service-actions">
                        <button
                          className="approve-btn"
                          onClick={() => handleApproveService(service._id)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => handleRejectService(service._id)}
                        >
                          ✕ Reject
                        </button>
                        <button
                          className="view-btn"
                          onClick={() => navigate(`/services/${service._id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-container">
                  <p className="no-data">No pending services to review</p>
                </div>
              )}
            </div>
          )}

          {/* Services Management Tab */}
          {activeTab === "services" && (
            <div className="services-tab">
              <div className="tab-header">
                <h2 style={{ color: "white" }}>Service Management</h2>
                <div className="header-actions">
                  <input
                    type="text"
                    placeholder="Search services..."
                    className="search-input"
                  />
                  <select className="filter-select">
                    <option>All Status</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                </div>
              </div>

              {loading.services ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="services-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Freelancer</th>
                        <th>Price</th>
                        <th>Orders</th>
                        <th>Rating</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service._id}>
                          <td>{service.title}</td>
                          <td>{service.freelancer?.name}</td>
                          <td>${service.price}</td>
                          <td>{service.totalOrders || 0}</td>
                          <td>⭐ {service.rating || "0"}</td>
                          <td>{service.status}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="icon-btn view"
                                onClick={() =>
                                  navigate(`/services/${service._id}`)
                                }
                              >
                                👁️
                              </button>
                              <button
                                className="icon-btn delete"
                                onClick={() => handleDeleteService(service._id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Orders Management Tab */}
          {activeTab === "orders" && (
            <div className="orders-tab">
              <h2 style={{ color: "white" }}>Order Management</h2>

              {loading.orders ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <div className="orders-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Service</th>
                        <th>Client</th>
                        <th>Freelancer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td className="order-id">#{order._id.slice(-6)}</td>
                          <td>{order.service?.title}</td>
                          <td>{order.client?.name}</td>
                          <td>{order.freelancer?.name}</td>
                          <td>${order.price}</td>
                          <td>
                            <span className={`order-status ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <button
                              className="icon-btn view"
                              onClick={() =>
                                navigate(`/admin/orders/${order._id}`)
                              }
                            >
                              👁️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="analytics-tab">
              <h2>Platform Analytics</h2>

              <div className="analytics-grid">
                <div className="chart-card">
                  <h3>User Growth</h3>
                  <div className="chart-placeholder">
                    {/* Chart would go here */}
                    <div className="mock-chart line-chart"></div>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Revenue Overview</h3>
                  <div className="chart-placeholder">
                    <div className="mock-chart bar-chart"></div>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Service Categories</h3>
                  <div className="chart-placeholder">
                    <div className="mock-chart pie-chart"></div>
                  </div>
                </div>

                <div className="chart-card">
                  <h3>Order Status Distribution</h3>
                  <div className="chart-placeholder">
                    <div className="mock-chart donut-chart"></div>
                  </div>
                </div>
              </div>

              <div className="analytics-stats">
                <div className="stat-row">
                  <span className="stat-name">Average Order Value</span>
                  <span className="stat-number">$156</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">Conversion Rate</span>
                  <span className="stat-number">3.2%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">User Retention</span>
                  <span className="stat-number">68%</span>
                </div>
                <div className="stat-row">
                  <span className="stat-name">Avg. Response Time</span>
                  <span className="stat-number">2.4 hrs</span>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="reports-tab">
              <h2>Reports & Issues</h2>

              <div className="reports-list">
                <div className="report-item">
                  <div className="report-header">
                    <span className="report-type urgent">🚨 Urgent</span>
                    <span className="report-date">2 hours ago</span>
                  </div>
                  <div className="report-content">
                    <p>
                      <strong>Reported User:</strong> John Doe (Freelancer)
                    </p>
                    <p>
                      <strong>Reason:</strong> Inappropriate content in service
                      description
                    </p>
                    <p>
                      <strong>Reported by:</strong> Client #1234
                    </p>
                  </div>
                  <div className="report-actions">
                    <button className="resolve-btn">✓ Resolve</button>
                    <button className="ignore-btn">✕ Ignore</button>
                    <button className="view-btn">View Details</button>
                  </div>
                </div>

                <div className="report-item">
                  <div className="report-header">
                    <span className="report-type warning">⚠️ Warning</span>
                    <span className="report-date">1 day ago</span>
                  </div>
                  <div className="report-content">
                    <p>
                      <strong>Reported User:</strong> Jane Smith (Client)
                    </p>
                    <p>
                      <strong>Reason:</strong> Payment dispute
                    </p>
                    <p>
                      <strong>Reported by:</strong> Freelancer #5678
                    </p>
                  </div>
                  <div className="report-actions">
                    <button className="resolve-btn">✓ Resolve</button>
                    <button className="ignore-btn">✕ Ignore</button>
                    <button className="view-btn">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
