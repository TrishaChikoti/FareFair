const express = require('express');
const router = express.Router();
const { getQuotes } = require('../controllers/rideController');

router.post('/quotes', getQuotes);

module.exports = router;
