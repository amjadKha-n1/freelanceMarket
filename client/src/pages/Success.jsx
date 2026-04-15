import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import API from "../api/axios";
import "./styles/payment.css";

const Success = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const fetchOrder = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get("orderId");

        if (orderId) {
          const { data } = await API.get(`/orders/${orderId}`);
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, []);

  return (
    <div className="payment-success-page">
      <div className="success-container">
        <div className="success-icon">🎉</div>
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>

        {loading ? (
          <div className="loading-spinner">Loading order details...</div>
        ) : order ? (
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Service:</span>
                <span>{order.service?.title}</span>
              </div>
              <div className="summary-row">
                <span>Amount:</span>
                <span>${order.price}</span>
              </div>
              <div className="summary-row">
                <span>Status:</span>
                <span className="status-badge success">Confirmed</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="order-info">
            Your order has been placed successfully. You'll receive a
            confirmation email shortly.
          </p>
        )}

        <div className="action-buttons">
          <Link to="/dashboard" className="primary-btn">
            Go to Dashboard
          </Link>
          <Link to="/services" className="secondary-btn">
            Browse More Services
          </Link>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>📦 The freelancer will start working on your order</li>
            <li>💬 You can message the freelancer directly</li>
            <li>
              ⏱️ Expected delivery:{" "}
              {order?.deadline
                ? new Date(order.deadline).toLocaleDateString()
                : "soon"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Success;
