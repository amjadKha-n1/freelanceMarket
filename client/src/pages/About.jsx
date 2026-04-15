import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "./styles/about.css";

const About = () => {
  const [stats, setStats] = useState({
    totalFreelancers: 0,
    totalProjects: 0,
    satisfactionRate: 98,
    totalReviews: 0,
    averageRating: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      const statsRes = await API.get("/admin/public-stats");

      const reviewsRes = await API.get("/reviews/latest?limit=3");

      setStats({
        totalFreelancers: statsRes.data.totalFreelancers || 0,
        totalProjects: statsRes.data.totalProjects || 0,
        satisfactionRate: statsRes.data.satisfactionRate || 98,
        totalReviews: statsRes.data.totalReviews || 0,
        averageRating: statsRes.data.averageRating || 0,
      });

      setReviews(reviewsRes.data.reviews || []);
    } catch (error) {
      console.error("Error fetching about page data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>Welcome to FreelanceMarket</h1>
          <p>Where Talent Meets Opportunity</p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">{stats.totalFreelancers}+</span>
              <span className="stat-label">Freelancers</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{stats.totalProjects}+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
            <div className="hero-stat">
              <span className="stat-number">{stats.satisfactionRate}%</span>
              <span className="stat-label">Satisfaction Rate</span>
            </div>
          </div>
        </div>
      </div>

      <div className="about-container">
        {/* Our Story Section */}
        <div className="about-section story-section">
          <div className="section-content">
            <h2>Our Story</h2>
            <p>
              FreelanceMarket was born from a simple idea:{" "}
              <strong>
                connect talented professionals with businesses that need their
                skills
              </strong>
              . Founded in 2024, our platform has grown into a vibrant community
              where freelancers and clients collaborate to bring amazing
              projects to life.
            </p>
            <p>
              We believe that{" "}
              <strong>great work should be accessible to everyone</strong>.
              Whether you're a freelancer looking to showcase your expertise or
              a business seeking top talent, FreelanceMarket provides the tools
              and support you need to succeed.
            </p>
          </div>
          <div className="section-image">
            <div className="image-placeholder story-image">🌍</div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="about-section mission-vision">
          <div className="mission-card">
            <div className="mission-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>
              To empower freelancers and businesses by creating a{" "}
              <strong>trusted, efficient, and fair marketplace</strong>
              where talent is recognized and work is valued.
            </p>
          </div>
          <div className="vision-card">
            <div className="vision-icon">👁️</div>
            <h3>Our Vision</h3>
            <p>
              To become the <strong>world's leading freelance platform</strong>,
              connecting millions of professionals with opportunities that
              transform their careers and businesses.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="about-section how-it-works">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3>Sign Up</h3>
              <p>
                Create your free account as a client or freelancer in minutes.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">🔍</div>
              <h3>Find or List Services</h3>
              <p>
                Clients browse services, freelancers showcase their expertise.
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">💬</div>
              <h3>Connect & Collaborate</h3>
              <p>
                Discuss requirements, negotiate terms, and build relationships.
              </p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-icon">💳</div>
              <h3>Pay Securely</h3>
              <p>Safe and secure payments through our integrated system.</p>
            </div>
            <div className="step">
              <div className="step-number">5</div>
              <div className="step-icon">✅</div>
              <h3>Deliver & Review</h3>
              <p>Get work done, leave reviews, and build your reputation.</p>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="about-section features">
          <h2>Why Choose FreelanceMarket?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Your payments are protected with our secure escrow system.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Reliable</h3>
              <p>Quick matching, responsive support, and reliable delivery.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🌍</div>
              <h3>Global Talent Pool</h3>
              <p>
                Access freelancers from around the world with diverse skills.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">💎</div>
              <h3>Quality Guaranteed</h3>
              <p>
                Verified freelancers and quality assurance for every project.
              </p>
            </div>
            <div className="feature">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Our dedicated support team is always here to help you.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Fair Commission</h3>
              <p>Transparent pricing with competitive commission rates.</p>
            </div>
          </div>
        </div>

        {/* For Freelancers & Clients */}
        <div className="about-section roles">
          <div className="role-card freelancer-role">
            <div className="role-icon">👨‍💻</div>
            <h2>For Freelancers</h2>
            <ul>
              <li>✓ Showcase your skills and portfolio</li>
              <li>✓ Set your own rates and availability</li>
              <li>✓ Access to {stats.totalFreelancers}+ job opportunities</li>
              <li>✓ Build your reputation with client reviews</li>
              <li>✓ Get paid securely and on time</li>
            </ul>
            <Link to="/become-freelancer" className="role-btn">
              Start Freelancing →
            </Link>
          </div>
          <div className="role-card client-role">
            <div className="role-icon">👔</div>
            <h2>For Clients</h2>
            <ul>
              <li>✓ Find top talent for any project</li>
              <li>✓ Compare freelancer profiles and reviews</li>
              <li>✓ Manage multiple projects in one dashboard</li>
              <li>✓ Secure payment protection</li>
              <li>✓ Get quality work delivered on time</li>
            </ul>
            <Link to="/services" className="role-btn">
              Hire a Freelancer →
            </Link>
          </div>
        </div>

        {/* Trust & Security */}
        <div className="about-section trust-section">
          <h2>Trust & Security</h2>
          <div className="trust-grid">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <h3>Verified Identity</h3>
              <p>
                All freelancers undergo verification to ensure authenticity.
              </p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🔐</span>
              <h3>Secure Transactions</h3>
              <p>Bank-grade encryption protects your financial information.</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚖️</span>
              <h3>Dispute Resolution</h3>
              <p>Fair mediation process for any disagreements.</p>
            </div>
            <div className="trust-item">
              <span className="trust-icon">📋</span>
              <h3>Terms Protection</h3>
              <p>Clear terms of service protect both parties.</p>
            </div>
          </div>
        </div>

        {/* Real Testimonials from Database */}
        <div className="about-section testimonials">
          <h2>What Our Community Says</h2>
          <div className="testimonials-grid">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={review._id || index} className="testimonial">
                  <div className="testimonial-content">
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
                    <p>"{review.comment}"</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {review.client?.name?.charAt(0) || "👤"}
                    </div>
                    <div>
                      <strong>{review.client?.name || "Anonymous"}</strong>
                      <span>
                        {review.service?.title || "Freelance Service"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-reviews-message">
                <p>Be the first to leave a review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="about-section cta-section">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of freelancers and businesses already using
            FreelanceMarket
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-btn primary">
              Sign Up Free
            </Link>
            <Link to="/services" className="cta-btn secondary">
              Browse Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
