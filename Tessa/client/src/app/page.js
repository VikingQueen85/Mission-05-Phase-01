
    'use client';

    import React, { useState, useEffect } from 'react';
    import axios from 'axios';

    export default function HomePage() {
      const [products, setProducts] = useState([]);
      const [searchTerm, setSearchTerm] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      // The API_BASE_PATH is now relative because of the next.config.js proxy
      const API_BASE_PATH = '/api';

      const fetchProducts = async (currentSearchTerm) => {
        setLoading(true);
        setError(null);
        try {
          const query = currentSearchTerm ? `?search=${encodeURIComponent(currentSearchTerm)}` : '';
          const response = await axios.get(`${API_BASE_PATH}/items${query}`);
          setProducts(response.data);
        } catch (e) {
          setError("Failed to fetch products: " + (e.response?.data?.message || e.message || e));
          setProducts([]);
        } finally {
          setLoading(false);
        }
      };

      // Initial fetch on component mount and re-fetch when search term changes
      useEffect(() => {
        fetchProducts(searchTerm);
      }, [searchTerm]);

      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
      };

      return (
        <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}>
          <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>TradeMe Auction Items</h1>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px', flexGrow: 1, maxWidth: '400px' }}
            />
          </div>

          {loading && <p style={{ textAlign: 'center', color: '#555' }}>Loading products...</p>}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>}
          
          {!loading && products.length === 0 && !error && <p style={{ textAlign: 'center', color: '#777' }}>No products found. Try seeding data if this is your first time.</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {products.map((product, index) => (
              <div key={product._id || index} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', backgroundColor: '#fdfdfd' }}>
                <h3 style={{ color: '#0056b3', marginBottom: '10px', fontSize: '1.4em' }}>{product.title}</h3>
                <p style={{ fontSize: '0.95em', color: '#666', lineHeight: '1.5', minHeight: '60px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.description}</p>
                <p style={{ fontWeight: 'bold', color: '#28a745', marginTop: '15px', fontSize: '1.1em' }}>Start Price: ${product.start_price?.toFixed(2) || 'N/A'}</p>
                <p style={{ fontWeight: 'bold', color: '#dc3545', fontSize: '1.1em' }}>Reserve Price: ${product.reserve_price?.toFixed(2) || 'N/A'}</p>
                {/* Displaying additional fields */}
                <p style={{ fontSize: '0.9em', color: '#555' }}>Current Price: ${product.current_price?.toFixed(2) || 'N/A'}</p>
                <p style={{ fontSize: '0.9em', color: '#555' }}>Seller: {product.seller || 'N/A'}</p>
                <p style={{ fontSize: '0.9em', color: '#555' }}>Ends: {product.end_time ? new Date(product.end_time).toLocaleDateString() : 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }