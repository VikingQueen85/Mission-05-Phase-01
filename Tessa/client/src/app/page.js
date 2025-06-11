
'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './homepage.module.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_PATH = '/api';

  const fetchProducts = async (currentSearchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const query = currentSearchTerm ? `?search=${encodeURIComponent(currentSearchTerm)}` : '';
      const response = await axios.get(`${API_BASE_PATH}/products${query}`);
      setProducts(response.data);
    } catch (e) {
      setError("Failed to fetch products: " + (e.response?.data?.message || e.message || e));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        TradeMe Auction Items
      </h1>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      {loading && <p className={`${styles.message} ${styles.loadingMessage}`}>Loading products...</p>}
      {error && <p className={`${styles.message} ${styles.errorMessage}`}>Error: {error}</p>}

      {!loading && products.length === 0 && !error && (
        <p className={`${styles.message} ${styles.noProductsMessage}`}>
          No products found. Try seeding data if this is your first time.
        </p>
      )}

      <div className={styles.productsGrid}>
        {products.map((product, index) => {
          const title = product.title || 'N/A';
          const description = product.description || 'N/A';
          const category = product.category || 'N/A';
          const startPrice = (product.start_price !== undefined && product.start_price !== null) ? `$${product.start_price.toFixed(2)}` : 'N/A';
          const reservePrice = (product.reserve_price !== undefined && product.reserve_price !== null) ? `$${product.reserve_price.toFixed(2)}` : 'N/A';
          const currentPrice = (product.current_price !== undefined && product.current_price !== null) ? `$${product.current_price.toFixed(2)}` : 'N/A';
          const endTime = product.end_time ? new Date(product.end_time).toLocaleDateString() : 'N/A';
          const seller = product.seller || 'N/A';
          const imageUrl = (product.image_urls && product.image_urls.length > 0 && product.image_urls[0])
                            ? product.image_urls[0]
                            : 'https://placehold.co/300x200/eeeeee/black?text=No+Image';
          const condition = product.condition || 'N/A';

          return (
            <div key={product._id || index} className={styles.productCard}>
              <img
                src={imageUrl}
                alt={title}
                className={styles.productImage}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x200/eeeeee/black?text=Image+Error'; }}
              />
              <h3 className={styles.productTitle}>{title}</h3>
              <p className={styles.productDescription}>{description}</p>
              <div className={styles.productDetails}>
                <p className={`${styles.priceBold} ${styles.startPrice}`}>Start Price: {startPrice}</p>
                <p className={`${styles.priceBold} ${styles.reservePrice}`}>Reserve Price: {reservePrice}</p>
                <p className={styles.detailText}>Current Price: {currentPrice}</p>
                <p className={styles.detailText}>Category: {category}</p>
                <p className={styles.detailText}>Condition: {condition}</p>
                <p className={styles.detailText}>Seller: {seller}</p>
                <p className={styles.detailText}>Ends: {endTime}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}