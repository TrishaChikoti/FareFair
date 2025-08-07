// src/pages/Home.js
import React, { useState } from 'react';
import axios from 'axios';
import RideSearchForm from '../components/RideSearchForm';
import RideResults from '../components/RideResults';

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError('');

    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_BASE_URL}/api/rides/search`, searchData);

      // Log full backend response for debugging
      console.log('Ride search response:', response.data);

      // Adjust this line based on backend response structure
      // If backend returns {data: {results: [...]}}:
      if (response.data.data && response.data.data.results) {
        setSearchResults(response.data.data.results);
      }
      // Fallback: If backend returns {results: [...]}
      else if (response.data.results) {
        setSearchResults(response.data.results);
      } else {
        setSearchResults([]);
        setError('Unexpected response from server.');
      }
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to search rides'
      );
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '16px' }}>
          FareFair
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.2rem' }}>
          Compare. Choose. Save.
        </p>
      </div>

      <div className="card">
        <RideSearchForm onSearch={handleSearch} loading={loading} />
      </div>

      {error && (
        <div className="error" style={{ color: 'red', margin: '16px 0' }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ color: 'white', margin: '16px 0' }}>
          Loading...
        </div>
      )}

      {!loading && !error && searchResults.length === 0 && (
        <div style={{ color: 'white', margin: '16px 0' }}>
          No rides found for your search.
        </div>
      )}

      {searchResults.length > 0 && (
        <RideResults results={searchResults} />
      )}
    </div>
  );
};

export default Home;

