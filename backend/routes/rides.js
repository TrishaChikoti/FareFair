const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/rideController');
const auth = require('../middleware/auth');

// @route   POST /api/rides/search
// @desc    Search for ride fares across providers
// @access  Public
router.post('/search',
  [
    body('from').notEmpty().withMessage('Pickup location is required'),
    body('to').notEmpty().withMessage('Destination is required'),
    body('vehicleType').optional().isIn(['bike', 'auto', 'car'])
  ],
  rideController.searchRides
);

// @route   GET /api/rides/history
// @desc    Get user's ride search history
// @access  Private
router.get('/history', auth, rideController.getRideHistory);

// @route   POST /api/rides/book
// @desc    Book a ride (redirect to provider)
// @access  Private  
router.post('/book', auth,
  [
    body('provider').isIn(['uber', 'ola', 'rapido']),
    body('rideQueryId').isMongoId()
  ],
  rideController.bookRide
);

// @route   GET /api/rides/providers
// @desc    Get available providers for a location
// @access  Public
router.get('/providers', rideController.getProviders);

module.exports = router;
