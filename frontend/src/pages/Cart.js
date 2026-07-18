// ============================================
// Cart Page
// ============================================
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../services/cartService";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowLeft,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const response = await getCart();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(true);
    try {
      const response = await updateCartItem(itemId, newQuantity);
      if (response.success) {
        setCart(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setIsUpdating(true);
    try {
      const response = await removeFromCart(itemId);
      if (response.success) {
        setCart(response.data);
        toast.success("Item removed");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    setIsUpdating(true);
    try {
      const response = await clearCart();
      if (response.success) {
        setCart(response.data);
        toast.success("Cart cleared");
      }
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <FiShoppingCart size={64} />
            <h2>Please login to view your cart</h2>
            <p>Login to add items and manage your cart.</p>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <FiShoppingCart size={64} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <div className="cart-header-actions">
            <span className="cart-count">{cart.itemCount} items</span>
            <button className="btn-clear" onClick={handleClearCart} disabled={isUpdating}>
              <FiTrash2 /> Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={
                      item.product.image ||
                      "https://via.placeholder.com/100x100?text=No+Image"
                    }
                    alt={item.product.name}
                  />
                </div>

                <div className="cart-item-info">
                  <Link to={`/products/${item.product.id}`} className="cart-item-name">
                    {item.product.name}
                  </Link>
                  <span className="cart-item-category">{item.product.category}</span>
                  <span className="cart-item-price">
                    ${item.product.price.toFixed(2)} each
                  </span>
                </div>

                <div className="cart-item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={isUpdating || item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    disabled={isUpdating || item.quantity >= item.product.stock}
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="btn-remove"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isUpdating}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items ({cart.itemCount})</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="summary-free">Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn-continue-shopping">
              <FiArrowLeft /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;