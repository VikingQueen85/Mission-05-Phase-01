
import React, { useState, useEffect } from "react";
import axios from "axios";
import './HomePage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        
        console.log("Raw data from backend:", response.data);
        setProducts(response.data);

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">Error: {error}</div>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="page-container">
      <h1 className="main-header">
        TradeMe Auction Items
      </h1>

      {products && Array.isArray(products) && products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => {
            console.log("Rendering product:", product);
            return (
            <div
              key={product._id}
              className="product-card"
            >
              {product.image_urls && product.image_urls.length > 0 ? (
                <img
                  src={product.image_urls[0]}
                  alt={product.title}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x200/cccccc/ffffff?text=No+Image`;
                  }}
                />
              ) : (
                <div className="no-image-placeholder">
                  No Image Available
                </div>
              )}

              <div className="product-info-panel">
                <h2 className="product-title">
                  {product.title}
                </h2>
                <p className="product-description">
                  {product.description || 'No description available.'}
                </p>
                <div className="product-details">
                  <p><span className="detail-label">Start Price:</span> <span className="price-start">${product.start_price ? product.start_price.toFixed(2) : 'N/A'}</span></p>
                  <p><span className="detail-label">Reserve Price:</span> <span className="price-reserve">${product.reserve_price ? product.reserve_price.toFixed(2) : 'N/A'}</span></p>
                  <p><span className="detail-label">Current Price:</span> <span className="price-current">${product.current_price ? product.current_price.toFixed(2) : 'N/A'}</span></p>
                  <p><span className="detail-label">Category:</span> <span className="detail-value">{product.category || 'N/A'}</span></p>
                  <p><span className="detail-label">Condition:</span> <span className="detail-value">{product.condition || 'N/A'}</span></p>
                  <p><span className="detail-label">Seller:</span> <span className="detail-value">{product.seller || 'N/A'}</span></p>
                  <p><span className="detail-label">Ends:</span> <span className="detail-value">{product.end_time ? formatDate(product.end_time) : 'N/A'}</span></p>
                </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <p className="no-products-message">
          No products found. Please check your backend API or seed data.
        </p>
      )}
    </div>
  );
}