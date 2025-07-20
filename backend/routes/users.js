const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth,
  [
    body('name').optional().notEmpty(),
    body('phone').optional().isMobilePhone(),
    body('preferences.defaultVehicleType').optional().isIn(['bike', 'auto', 'car'])
  ],
  userController.updateProfile
);

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, userController.updatePreferences);

module.exports = router;
