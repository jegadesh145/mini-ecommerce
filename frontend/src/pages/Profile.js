// ============================================
// Profile Page
// ============================================
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordStrength from "../components/PasswordStrength";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  changePassword,
  deactivateAccount,
} from "../services/profileService";
import {
  FiUser,
  FiMail,
  FiCamera,
  FiTrash2,
  FiLock,
  FiSave,
  FiAlertTriangle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef(null);

  // Profile state
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit profile state
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Deactivate state
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Avatar upload state
  const [isUploading, setIsUploading] = useState(false);

  // Load profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await getProfile();
      if (response.success) {
        setProfile(response.data);
        setName(response.data.name);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  // ============ Edit Profile ============
  const handleSaveProfile = async () => {
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters");
      return;
    }
    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      toast.error("Name can only contain letters and spaces");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateProfile({ name: name.trim() });
      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        toast.success("Profile updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // ============ Avatar Upload ============
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, and PNG files are allowed");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const response = await uploadAvatar(file);
      if (response.success) {
        setProfile(response.data);
        toast.success("Avatar updated");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploading(true);
    try {
      const response = await removeAvatar();
      if (response.success) {
        setProfile(response.data);
        toast.success("Avatar removed");
      }
    } catch (error) {
      toast.error("Failed to remove avatar");
    } finally {
      setIsUploading(false);
    }
  };

  // ============ Change Password ============
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await changePassword(passwordData);
      if (response.success) {
        setShowChangePassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        toast.success("Password changed successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ============ Deactivate Account ============
  const handleDeactivate = async () => {
    if (!deactivatePassword) {
      toast.error("Please enter your password");
      return;
    }

    setIsDeactivating(true);
    try {
      const response = await deactivateAccount(deactivatePassword);
      if (response.success) {
        toast.success("Account deactivated");
        logout();
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to deactivate account"
      );
    } finally {
      setIsDeactivating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          {/* Avatar Section */}
          <div className="profile-card avatar-card">
            <div className="avatar-wrapper">
              <div
                className="avatar"
                onClick={handleAvatarClick}
                style={{ cursor: "pointer" }}
              >
                {profile?.avatar ? (
                  <img
                    src={`${apiBase}${profile.avatar}`}
                    alt="Avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="avatar-overlay">
                  <FiCamera />
                  <span>Change</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept=".jpg,.jpeg,.png"
                style={{ display: "none" }}
              />
              {isUploading && <div className="spinner-sm" />}
            </div>
            {profile?.avatar && (
              <button
                className="btn-remove-avatar"
                onClick={handleRemoveAvatar}
                disabled={isUploading}
              >
                <FiTrash2 /> Remove
              </button>
            )}
          </div>

          {/* Profile Info Card */}
          <div className="profile-card info-card">
            <div className="card-header">
              <h2>Personal Information</h2>
              <button
                className="btn-edit"
                onClick={() =>
                  isEditing ? handleSaveProfile() : setIsEditing(true)
                }
              >
                {isEditing ? (
                  isSaving ? (
                    <span className="btn-loading">
                      <span className="spinner-sm"></span> Saving
                    </span>
                  ) : (
                    <>
                      <FiSave /> Save
                    </>
                  )
                ) : (
                  "Edit"
                )}
              </button>
            </div>

            <div className="info-row">
              <FiUser className="info-icon" />
              <div className="info-content">
                <label>Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                ) : (
                  <p>{profile?.name}</p>
                )}
              </div>
            </div>

            <div className="info-row">
              <FiMail className="info-icon" />
              <div className="info-content">
                <label>Email</label>
                <p>{profile?.email}</p>
              </div>
            </div>

            <div className="info-row">
              <FiUser className="info-icon" />
              <div className="info-content">
                <label>Role</label>
                <p className="role-badge">{profile?.role}</p>
              </div>
            </div>

            <div className="info-row">
              <FiUser className="info-icon" />
              <div className="info-content">
                <label>Member Since</label>
                <p>{new Date(profile?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="profile-card password-card">
            <div className="card-header">
              <h2>Security</h2>
              <button
                className="btn-edit"
                onClick={() => setShowChangePassword(!showChangePassword)}
              >
                <FiLock />{" "}
                {showChangePassword ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showChangePassword && (
              <form
                onSubmit={handlePasswordChange}
                className="password-form"
              >
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Enter current password"
                    disabled={isChangingPassword}
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                    disabled={isChangingPassword}
                  />
                  <PasswordStrength password={passwordData.newPassword} />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmNewPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm new password"
                    disabled={isChangingPassword}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <span className="btn-loading">
                      <span className="spinner-sm"></span> Updating...
                    </span>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Deactivate Account Card */}
          <div className="profile-card danger-card">
            <div className="card-header">
              <h2>Danger Zone</h2>
            </div>
            <p className="danger-description">
              Once you deactivate your account, you will not be able to
              access it again. This action cannot be undone.
            </p>

            {showDeactivate ? (
              <div className="deactivate-form">
                <div className="form-group">
                  <label>Enter your password to confirm:</label>
                  <input
                    type="password"
                    value={deactivatePassword}
                    onChange={(e) => setDeactivatePassword(e.target.value)}
                    placeholder="Your password"
                    disabled={isDeactivating}
                  />
                </div>
                <div className="deactivate-actions">
                  <button
                    className="btn btn-danger"
                    onClick={handleDeactivate}
                    disabled={isDeactivating}
                  >
                    {isDeactivating ? (
                      <span className="btn-loading">
                        <span className="spinner-sm"></span> Deactivating...
                      </span>
                    ) : (
                      "Yes, Deactivate My Account"
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeactivate(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn btn-danger-outline"
                onClick={() => setShowDeactivate(true)}
              >
                <FiAlertTriangle /> Deactivate Account
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;