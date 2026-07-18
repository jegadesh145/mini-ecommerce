// ============================================
// Register Page
// ============================================
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordStrength from "../components/PasswordStrength";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle input change
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  /**
   * Validate form
   */
  const validate = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Must contain an uppercase letter";
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = "Must contain a lowercase letter";
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Must contain a number";
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = "Must contain a special character";
      }
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    const result = await register(formData);
    setIsLoading(false);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join us and start shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
                disabled={isLoading}
              />
            </div>
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                disabled={isLoading}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <PasswordStrength password={formData.password} />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading">
                <span className="spinner-sm"></span>
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;