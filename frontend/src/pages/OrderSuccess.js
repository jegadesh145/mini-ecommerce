import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/orderService';
import '../styles/orderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async () => {
    try {
      const response = await getOrder(orderId);
      setOrder(response.data);
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="order-success-loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-success-error">
        <div className="error-icon">⚠️</div>
        <h2>Order Not Found</h2>
        <p>{error || 'The order you are looking for does not exist.'}</p>
        <Link to="/products" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <div className="success-animation">
        <div className="checkmark-circle">
          <div className="checkmark">✓</div>
        </div>
      </div>

      <div className="success-content">
        <h1>Order Confirmed!</h1>
        <p className="success-message">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        <div className="order-info-card">
          <div className="order-info-header">
            <h2>Order Details</h2>
            <span className="order-status-badge confirmed">Confirmed</span>
          </div>

          <div className="order-info-grid">
            <div className="info-item">
              <span className="info-label">Order ID</span>
              <span className="info-value">#{order.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Order Date</span>
              <span className="info-value">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Amount</span>
              <span className="info-value total-amount">${order.total.toFixed(2)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Payment Method</span>
              <span className="info-value">{order.paymentMethod}</span>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>

          <div className="order-items-section">
            <h3>Order Items</h3>
            {order.orderItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p className="item-quantity">Qty: {item.quantity}</p>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="success-actions">
          <Link to="/orders" className="view-orders-btn">
            View All Orders
          </Link>
          <Link to="/products" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>

        <div className="success-note">
          <p>
            📧 A confirmation email has been sent to your email address.
          </p>
          <p>
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;