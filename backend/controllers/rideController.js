const { validationResult } = require('express-validator');
const RideQuery = require('../models/RideQuery');
const rideProviders = require('../utils/rideProviders');

// @desc    Search for ride fares across providers
exports.searchRides = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { from, to, vehicleType = 'car' } = req.body;

    // Get quotes from all providers
    const results = await rideProviders.getAllQuotes({
      from,
      to,
      vehicleType
    });

    // Save query to database (if available)
    let queryId = null;
    try {
      const rideQuery = new RideQuery({
        user: req.user ? req.user.id : null,
        from: { address: from },
        to: { address: to },
        vehicleType,
        results
      });

      await rideQuery.save();
      queryId = rideQuery._id;
    } catch (dbError) {
      console.log('Database not available - skipping query save');
      // Continue without saving to database
    }

    res.json({
      success: true,
      data: {
        queryId: queryId,
        results: results.sort((a, b) => a.price - b.price) // Sort by price
      }
    });

  } catch (error) {
    console.error('Search rides error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to search rides' 
    });
  }
};

// @desc    Get user's ride search history
exports.getRideHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const rideQueries = await RideQuery.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await RideQuery.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: {
        rideQueries,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    });

  } catch (error) {
    console.error('Get ride history error:', error);
    // Return empty results if database is not available
    res.json({
      success: true,
      data: {
        rideQueries: [],
        totalPages: 0,
        currentPage: page
      }
    });
  }
};

// @desc    Book a ride (redirect to provider)
exports.bookRide = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { provider, rideQueryId } = req.body;

    // Update the ride query with selected provider
    await RideQuery.findByIdAndUpdate(rideQueryId, {
      selectedProvider: provider,
      status: 'completed'
    });

    // In a real app, this would redirect to the provider's booking URL
    const bookingUrls = {
      uber: 'https://uber.com',
      ola: 'https://olacabs.com', 
      rapido: 'https://rapido.bike'
    };

    res.json({
      success: true,
      data: {
        bookingUrl: bookingUrls[provider],
        message: `Redirecting to ${provider} for booking`
      }
    });

  } catch (error) {
    console.error('Book ride error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to book ride' 
    });
  }
};

// @desc    Get available providers for a location
exports.getProviders = async (req, res) => {
  try {
    const providers = [
      {
        name: 'uber',
        displayName: 'Uber',
        logo: '/logos/uber.png',
        vehicleTypes: ['bike', 'auto', 'car']
      },
      {
        name: 'ola',
        displayName: 'Ola', 
        logo: '/logos/ola.png',
        vehicleTypes: ['bike', 'auto', 'car']
      },
      {
        name: 'rapido',
        displayName: 'Rapido',
        logo: '/logos/rapido.png', 
        vehicleTypes: ['bike']
      }
    ];

    res.json({
      success: true,
      data: providers
    });

  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get providers' 
    });
  }
};
