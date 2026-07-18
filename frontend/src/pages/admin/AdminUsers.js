// ============================================
// Admin Users Management Page
// ============================================
import React, { useState, useEffect } from "react";
import { getUsers, updateUser, deleteUser } from "../../services/adminService";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiTrash2,
  FiMail,
  FiShield,
} from "react-icons/fi";
import "./admin.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, editingUser);
      toast.success("User updated successfully");
      setShowModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={fetchUsers} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Users Management</h1>
          <p className="page-subtitle">Manage all registered users</p>
        </div>
        <div className="page-stats">
          <span className="stat-badge">{users.length} Total Users</span>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>#{user.id}</td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td>
                    <div className="email-cell">
                      <FiMail size={14} />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      <FiShield size={14} />
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(user)}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit User</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;