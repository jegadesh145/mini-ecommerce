// ============================================
// Profile Service
// ============================================
import api from "./api";

/**
 * Get user profile
 * @returns {Promise} - { success, data }
 */
export const getProfile = async () => {
  const response = await api.get("/api/profile");
  return response.data;
};

/**
 * Update profile (name)
 * @param {object} data - { name }
 * @returns {Promise}
 */
export const updateProfile = async (data) => {
  const response = await api.put("/api/profile", data);
  return response.data;
};

/**
 * Upload avatar image
 * @param {File} file - Image file (JPG/PNG, max 5MB)
 * @returns {Promise}
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await api.put("/api/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Remove avatar
 * @returns {Promise}
 */
export const removeAvatar = async () => {
  const response = await api.delete("/api/profile/avatar");
  return response.data;
};

/**
 * Change password
 * @param {object} data - { currentPassword, newPassword, confirmNewPassword }
 * @returns {Promise}
 */
export const changePassword = async (data) => {
  const response = await api.put("/api/profile/password", data);
  return response.data;
};

/**
 * Deactivate account
 * @param {string} password - Current password for verification
 * @returns {Promise}
 */
export const deactivateAccount = async (password) => {
  const response = await api.delete("/api/profile", {
    data: { password },
  });
  return response.data;
};