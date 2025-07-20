import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchRideHistory();
  }, [isAuthenticated, navigate]);

  const fetchRideHistory = async () => {
    try {
      const response = await axios.get('/api/rides/history');
      setRideHistory(response.data.data.rideQueries);
    } catch (error) {
      setError('Failed to fetch ride history');
      console.error('Fetch history error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '40px' }}>
        Ride History
      </h1>

      {loading ? (
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : rideHistory.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3 style={{ color: '#666', marginBottom: '16px' }}>No ride history found</h3>
            <p style={{ color: '#888' }}>Start searching for rides to see your history here.</p>
          </div>
        </div>
      ) : (
        <div className="grid">
          {rideHistory.map((ride) => (
            <div key={ride._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ color: '#333', marginBottom: '8px' }}>
                    {ride.from?.address} → {ride.to?.address}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', color: '#666', fontSize: '14px' }}>
                    <span>🚗 {ride.vehicleType}</span>
                    <span>📅 {formatDate(ride.createdAt)}</span>
                    {ride.selectedProvider && (
                      <span style={{ color: '#667eea', fontWeight: '600' }}>
                        ✓ Booked with {ride.selectedProvider}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {ride.results && ride.results.length > 0 && (
                <div>
                  <h4 style={{ color: '#333', marginBottom: '12px', fontSize: '16px' }}>
                    Price Comparison
                  </h4>
                  <div className="grid grid-3">
                    {ride.results.map((result, index) => (
                      <div key={index} style={{
                        padding: '12px',
                        border: '1px solid #e1e5e9',
                        borderRadius: '8px',
                        textAlign: 'center',
                        backgroundColor: ride.selectedProvider === result.provider ? '#f0f8ff' : 'transparent'
                      }}>
                        <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                          {result.provider}
                        </div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>
                          ₹{result.price}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {result.estimatedPickupTime}m pickup
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
