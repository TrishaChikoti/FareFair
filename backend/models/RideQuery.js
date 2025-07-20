const mongoose = require('mongoose');

const rideQuerySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  from: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  to: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'auto', 'car'],
    required: true,
    default: 'car'
  },
  results: [{
    provider: {
      type: String,
      enum: ['uber', 'ola', 'rapido'],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    estimatedPickupTime: Number, // in minutes
    estimatedTripTime: Number,   // in minutes
    vehicleDetails: {
      type: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      }
    },
    availability: {
      type: Boolean,
      default: true
    }
  }],
  selectedProvider: {
    type: String,
    enum: ['uber', 'ola', 'rapido']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Index for geospatial queries
rideQuerySchema.index({ 'from.coordinates': '2dsphere' });
rideQuerySchema.index({ 'to.coordinates': '2dsphere' });

module.exports = mongoose.model('RideQuery', rideQuerySchema);
