import { Link } from "react-router-dom";
import "./styles/payment.css";

const Cancel = () => {
  return (
    <div className="payment-cancel-page">
      <div className="cancel-container">
        <div className="cancel-icon">😕</div>
        <h1>Payment Cancelled</h1>
        <p className="cancel-message">
          Your payment was not completed. No charges have been made.
        </p>

        <div className="action-buttons">
          <Link to="/services" className="primary-btn">
            Try Again
          </Link>
          <Link to="/" className="secondary-btn">
            Go to Homepage
          </Link>
        </div>

        <div className="help-section">
          <h3>Need Help?</h3>
          <p style={{ color: "white" }}>
            If you experienced any issues during payment, you can:
          </p>
          <ul>
            <li>🔄 Try a different payment method</li>
            <li>📞 Contact your bank if the payment was blocked</li>
            <li>💬 Reach out to our support team</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Cancel;
