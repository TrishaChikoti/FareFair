import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RideSearchForm from '../components/RideSearchForm';
import axios from 'axios';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchRecentSearches();
  }, [isAuthenticated, navigate]);

  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get('/api/rides/history?limit=5');
      setRecentSearches(response.data.data.rideQueries);
    } catch (error) {
      console.error('Failed to fetch recent searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchData) => {
    try {
      const response = await axios.post('/api/rides/search', searchData);
      // Handle search results - could navigate to results page or show inline
      console.log('Search results:', response.data.data.results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>
          Welcome back, {user?.name}!
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Ready to find the best ride for your journey?
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Search Rides</h3>
          <RideSearchForm onSearch={handleSearch} />
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '20px', color: '#333' }}>Recent Searches</h3>
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : recentSearches.length > 0 ? (
            <div>
              {recentSearches.map((search, index) => (
                <div key={search._id || index} style={{
                  padding: '12px',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                    {search.from?.address} → {search.to?.address}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {search.vehicleType} • {new Date(search.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#666' }}>No recent searches found.</p>
          )}
        </div>
      </div>

      <div className="grid grid-3" style={{ marginTop: '40px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#667eea', marginBottom: '12px' }}>Total Searches</h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>
            {recentSearches.length}
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#667eea', marginBottom: '12px' }}>Money Saved</h4>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            ₹0
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h4 style={{ color: '#667eea', marginBottom: '12px' }}>Favorite Provider</h4>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
            -
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
