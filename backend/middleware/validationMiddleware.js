// ============================================
// Validation Middleware
// ============================================

/**
 * Validate registration input
 */
const validateRegister = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  } else if (name.trim().length < 3) {
    errors.push("Name must be at least 3 characters");
  } else if (name.trim().length > 30) {
    errors.push("Name must be less than 30 characters");
  } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
    errors.push("Name can only contain letters and spaces");
  }

  // Email validation
  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push("Please provide a valid email address");
  }

  // Password validation
  if (!password) {
    errors.push("Password is required");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (password.length > 30) {
      errors.push("Password must be less than 30 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
  }

  // Confirm password validation
  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Sanitize inputs
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validate login input
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  }

  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validate profile update input
 */
const validateProfileUpdate = (req, res, next) => {
  const { name } = req.body;
  const errors = [];

  if (name) {
    if (name.trim().length < 3) {
      errors.push("Name must be at least 3 characters");
    }
    if (name.trim().length > 30) {
      errors.push("Name must be less than 30 characters");
    }
    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      errors.push("Name can only contain letters and spaces");
    }
    req.body.name = name.trim();
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

/**
 * Validate password change input
 */
const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const errors = [];

  if (!currentPassword) {
    errors.push("Current password is required");
  }

  if (!newPassword) {
    errors.push("New password is required");
  } else {
    if (newPassword.length < 8) {
      errors.push("New password must be at least 8 characters");
    }
    if (newPassword.length > 30) {
      errors.push("New password must be less than 30 characters");
    }
    if (!/[A-Z]/.test(newPassword)) {
      errors.push("New password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(newPassword)) {
      errors.push("New password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(newPassword)) {
      errors.push("New password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      errors.push("New password must contain at least one special character");
    }
  }

  if (!confirmNewPassword) {
    errors.push("Please confirm your new password");
  } else if (newPassword !== confirmNewPassword) {
    errors.push("New passwords do not match");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
};