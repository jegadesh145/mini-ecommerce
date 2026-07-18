// ============================================
// Admin Products Management Page
// ============================================
import React, { useState, useEffect } from "react";
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from "../../services/adminService";
import toast from "react-hot-toast";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
} from "react-icons/fi";
import "./admin.css";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    rating: 0,
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAdminProducts();
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      rating: 0,
      stock: "",
    });
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image || "",
      rating: product.rating,
      stock: product.stock.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.rating),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(editingProduct ? "Failed to update product" : "Failed to create product");
    }
  };

  const categories = ["Electronics", "Accessories", "Clothing", "Home", "Sports"];

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
        <button onClick={fetchProducts} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Products Management</h1>
          <p className="page-subtitle">Manage your product catalog</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          <FiPlus /> Add Product
        </button>
      </div>

      <div className="admin-table-container">
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>#{product.id}</td>
                  <td>
                    <img
                      src={product.image || "https://via.placeholder.com/50"}
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>
                    <div className="product-name-cell">
                      {product.name}
                    </div>
                  </td>
                  <td>
                    <span className="category-badge">{product.category}</span>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </td>
                  <td>
                    <div className="rating-cell">
                      <span className="rating-value">{product.rating}</span>
                      <span className="rating-stars">⭐</span>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product.id)}
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows="3"
                  placeholder="Enter product description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    placeholder="4.5"
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
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
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;