const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Get user profile
router.get('/profile', auth, userController.getProfile);

// Update user profile
router.put('/profile', auth,
  [
    body('name').optional().notEmpty(),
    body('phone').optional().isMobilePhone(),
    body('preferences.defaultVehicleType').optional().isIn(['bike', 'auto', 'car'])
  ],
  userController.updateProfile
);

// Update preferences
router.put('/preferences', auth, userController.updatePreferences);

module.exports = router;
