// ============================================
// Product Card Component
// ============================================
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiStar, FiShoppingCart } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../services/cartService";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FiStar key={i} className="star filled" />);
      } else if (i === fullStars && hasHalf) {
        stars.push(<FiStar key={i} className="star half" />);
      } else {
        stars.push(<FiStar key={i} className="star empty" />);
      }
    }
    return stars;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product.id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-image">
        <img
          src={product.image || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name}
          loading="lazy"
        />
      </Link>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <Link to={`/products/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-description">
          {product.description?.length > 80
            ? `${product.description.substring(0, 80)}...`
            : product.description}
        </p>
        <div className="product-rating">
          <div className="stars">{renderStars(product.rating)}</div>
          <span className="rating-value">({product.rating})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button 
            className="btn-add-cart" 
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            <FiShoppingCart /> {isAdding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;