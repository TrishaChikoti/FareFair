import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const RideResults = ({ results }) => {
  const { isAuthenticated } = useAuth();
  const [sortBy, setSortBy] = useState('price');
  const [bookingStatus, setBookingStatus] = useState({});

  const sortResults = (results, sortBy) => {
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'pickup':
          return a.estimatedPickupTime - b.estimatedPickupTime;
        case 'trip':
          return a.estimatedTripTime - b.estimatedTripTime;
        default:
          return 0;
      }
    });
  };

  const handleBookRide = async (provider, result) => {
    if (!isAuthenticated) {
      alert('Please login to book a ride');
      return;
    }

    setBookingStatus({ ...bookingStatus, [provider]: 'booking' });

    try {
      const response = await axios.post('/api/rides/book', {
        provider,
        rideQueryId: result.queryId || 'demo'
      });

      setBookingStatus({ ...bookingStatus, [provider]: 'success' });

      // In a real app, this would redirect to the provider's booking page
      if (response.data.data.bookingUrl) {
        window.open(response.data.data.bookingUrl, '_blank');
      }

      setTimeout(() => {
        setBookingStatus({ ...bookingStatus, [provider]: null });
      }, 3000);

    } catch (error) {
      setBookingStatus({ ...bookingStatus, [provider]: 'error' });
      console.error('Booking failed:', error);

      setTimeout(() => {
        setBookingStatus({ ...bookingStatus, [provider]: null });
      }, 3000);
    }
  };

  const sortedResults = sortResults(results, sortBy);
  const cheapestPrice = Math.min(...results.map(r => r.price));

  return (
    <div style={{ marginTop: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ color: 'white', margin: 0 }}>
          Found {results.length} ride options
        </h3>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            backgroundColor: 'white'
          }}
        >
          <option value="price">Sort by Price</option>
          <option value="pickup">Sort by Pickup Time</option>
          <option value="trip">Sort by Trip Time</option>
        </select>
      </div>

      <div className="grid grid-3">
        {sortedResults.map((result, index) => {
          const isCheapest = result.price === cheapestPrice;
          const status = bookingStatus[result.provider];

          return (
            <div key={`${result.provider}-${index}`} className="card" style={{
              position: 'relative',
              border: isCheapest ? '2px solid #28a745' : '1px solid #e1e5e9'
            }}>
              {isCheapest && (
                <div style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '16px',
                  background: '#28a745',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  CHEAPEST
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#333',
                  textTransform: 'capitalize',
                  marginBottom: '8px'
                }}>
                  {result.provider}
                </div>

                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold', 
                  color: isCheapest ? '#28a745' : '#667eea',
                  marginBottom: '4px'
                }}>
                  ₹{result.price}
                </div>

                {result.vehicleDetails && (
                  <div style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                    {result.vehicleDetails.category}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Pickup Time:</span>
                  <span style={{ fontWeight: '600' }}>{result.estimatedPickupTime} min</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#666' }}>Trip Time:</span>
                  <span style={{ fontWeight: '600' }}>{result.estimatedTripTime} min</span>
                </div>

                {result.surge && (
                  <div style={{
                    background: '#fff3cd',
                    color: '#856404',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}>
                    Surge pricing active
                  </div>
                )}
              </div>

              <button
                onClick={() => handleBookRide(result.provider, result)}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  backgroundColor: status === 'success' ? '#28a745' : 
                                  status === 'error' ? '#dc3545' : '#667eea',
                  opacity: !result.availability ? 0.6 : 1
                }}
                disabled={!result.availability || status === 'booking'}
              >
                {status === 'booking' ? 'Booking...' :
                 status === 'success' ? 'Booked!' :
                 status === 'error' ? 'Failed' :
                 !result.availability ? 'Unavailable' :
                 `Book with ${result.provider}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RideResults;
