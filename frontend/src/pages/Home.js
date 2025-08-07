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
      setSearchResults(response.data.data.results);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to search rides');
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
        <div className="error">
          {error}
        </div>
      )}

      {searchResults.length > 0 && (
        <RideResults results={searchResults} />
      )}
    </div>
  );
};

export default Home;
