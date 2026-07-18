// ============================================
// Password Strength Indicator Component
// ============================================
import React from "react";

/**
 * Calculate password strength
 * @param {string} password
 * @returns {object} { score, label, color }
 */
const getPasswordStrength = (password) => {
  let score = 0;

  if (!password) return { score: 0, label: "", color: "", width: "0%" };

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety
  if (/[a-z]/.test(password)) score += 1; // lowercase
  if (/[A-Z]/.test(password)) score += 1; // uppercase
  if (/[0-9]/.test(password)) score += 1; // number
  if (/[^a-zA-Z0-9]/.test(password)) score += 1; // special char

  // Determine strength level
  if (score <= 2) {
    return { score, label: "Weak", color: "#e74c3c", width: "33%" };
  } else if (score <= 4) {
    return { score, label: "Medium", color: "#f39c12", width: "66%" };
  } else {
    return { score, label: "Strong", color: "#2ecc71", width: "100%" };
  }
};

/**
 * PasswordStrength - visual indicator for password strength
 */
const PasswordStrength = ({ password }) => {
  const { label, color, width } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength-bar">
        <div
          className="password-strength-fill"
          style={{
            width,
            backgroundColor: color,
            transition: "width 0.3s ease, background-color 0.3s ease",
          }}
        />
      </div>
      <span
        className="password-strength-label"
        style={{ color }}
      >
        {label}
      </span>
    </div>
  );
};

export default PasswordStrength;