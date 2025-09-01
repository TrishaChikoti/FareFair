const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/rideController');
const auth = require('../middleware/auth');

// Search rides
router.post('/search',
  [
    body('from').notEmpty().withMessage('Pickup location required'),
    body('to').notEmpty().withMessage('Destination required'),
    body('vehicleType').optional().isIn(['bike', 'auto', 'car'])
  ],
  rideController.searchRides
);

// Get ride history
router.get('/history', auth, rideController.getRideHistory);

// Book a ride
router.post('/book', auth,
  [
    body('provider').isIn(['uber', 'ola', 'rapido']),
    body('rideQueryId').isMongoId()
  ],
  rideController.bookRide
);

// Get providers
router.get('/providers', rideController.getProviders);

module.exports = router;
