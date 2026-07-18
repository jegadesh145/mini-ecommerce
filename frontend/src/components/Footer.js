// ============================================
// Footer Component
// ============================================
import React from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiGithub, FiTwitter, FiMail } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section brand-section">
            <Link to="/" className="footer-logo">
              <FiShoppingBag className="logo-icon" />
              <span>MiniShop</span>
            </Link>
            <p className="footer-description">
              Your one-stop shop for everything. Quality products at
              affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} MiniShop. All rights reserved.</p>
          <div className="footer-social">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <FiGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="mailto:support@minishop.com" aria-label="Email">
              <FiMail />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;