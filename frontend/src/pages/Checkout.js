// ============================================
// Checkout Page
// ============================================
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { FiCheck, FiMapPin, FiPhone } from "react-icons/fi";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacing, setIsPlacing] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: "",
    phone: "",
  });

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCart = async () => {
    try {
      const response = await getCart();
      if (response.success) {
        if (response.data.items.length === 0) {
          navigate("/cart");
          return;
        }
        setCart(response.data);
      }
    } catch (error) {
      toast.error("Failed to load cart");
      navigate("/cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.shippingAddress.trim()) {
      toast.error("Shipping address is required");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    setIsPlacing(true);
    try {
      const response = await createOrder(formData);
      if (response.success) {
        toast.success("Order placed successfully!");
        navigate(`/orders/${response.data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setIsPlacing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
        </div>

        <div className="checkout-layout">
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="checkout-card">
              <h2>Shipping Information</h2>
              <div className="form-group">
                <label htmlFor="shippingAddress">
                  <FiMapPin /> Shipping Address
                </label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  rows="3"
                  placeholder="Enter your full shipping address"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  disabled={isPlacing}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">
                  <FiPhone /> Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isPlacing}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={isPlacing}
            >
              {isPlacing ? (
                <span className="btn-loading">
                  <span className="spinner-sm"></span> Placing Order...
                </span>
              ) : (
                <>
                  <FiCheck /> Place Order — ${cart?.total?.toFixed(2)}
                </>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            {cart?.items?.map((item) => (
              <div key={item.id} className="checkout-item">
                <img
                  src={
                    item.product.image ||
                    "https://via.placeholder.com/60x60?text=N"
                  }
                  alt={item.product.name}
                />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.product.name}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <span className="checkout-item-price">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="checkout-summary-divider"></div>
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>${cart?.total?.toFixed(2)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span className="free">Free</span>
            </div>
            <div className="checkout-summary-divider"></div>
            <div className="checkout-summary-row total">
              <span>Total</span>
              <span>${cart?.total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;