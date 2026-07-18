import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../services/orderService';
import '../styles/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'processing':
        return 'processing';
      case 'shipped':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-error">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Orders</h2>
        <p>{error}</p>
        <button onClick={fetchOrders} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p className="orders-subtitle">Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders. Start shopping to see your orders here!</p>
          <Link to="/products" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-card-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`order-status ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-items-preview">
                  {order.orderItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="order-item-preview">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="item-preview-image"
                      />
                      <div className="item-preview-details">
                        <h4>{item.product.name}</h4>
                        <p>Qty: {item.quantity}</p>
                        <p className="item-price">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="more-items">
                      +{order.orderItems.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="order-card-footer">
                  <div className="order-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="order-actions">
                    <Link
                      to={`/order-success/${order.id}`}
                      className="view-details-btn"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;