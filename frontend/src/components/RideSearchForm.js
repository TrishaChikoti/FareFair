import React, { useState } from 'react';

const RideSearchForm = ({ onSearch, loading = false }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    vehicleType: 'car'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.from || !formData.to) {
      alert('Please enter both pickup and destination locations');
      return;
    }
    onSearch(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">From</label>
        <input
          type="text"
          name="from"
          value={formData.from}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter pickup location"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">To</label>
        <input
          type="text"
          name="to"
          value={formData.to}
          onChange={handleChange}
          className="form-input"
          placeholder="Enter destination"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Vehicle Type</label>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          {[
            { id: 'bike', label: 'Bike', emoji: '🏍️' },
            { id: 'auto', label: 'Auto', emoji: '🛺' },
            { id: 'car', label: 'Car', emoji: '🚗' }
          ].map(vehicle => (
            <label key={vehicle.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '12px 16px',
              border: '2px solid',
              borderColor: formData.vehicleType === vehicle.id ? '#667eea' : '#e1e5e9',
              borderRadius: '8px',
              backgroundColor: formData.vehicleType === vehicle.id ? '#f0f8ff' : 'white',
              transition: 'all 0.3s ease',
              flex: 1,
              justifyContent: 'center'
            }}>
              <input
                type="radio"
                name="vehicleType"
                value={vehicle.id}
                checked={formData.vehicleType === vehicle.id}
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: '20px' }}>{vehicle.emoji}</span>
              <span style={{
                fontWeight: '500',
                color: formData.vehicleType === vehicle.id ? '#667eea' : '#333'
              }}>
                {vehicle.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', fontSize: '16px', padding: '14px' }}
        disabled={loading}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #ffffff40', borderTop: '2px solid white' }}></div>
            Searching...
          </span>
        ) : (
          'Search Rides'
        )}
      </button>
    </form>
  );
};

export default RideSearchForm;
