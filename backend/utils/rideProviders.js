const axios = require('axios');

// Mock data for ride providers when real APIs are not available
const mockRideData = {
  uber: {
    bike: { basePrice: 15, perKm: 8, surgeMultiplier: 1.0 },
    auto: { basePrice: 25, perKm: 12, surgeMultiplier: 1.0 },
    car: { basePrice: 40, perKm: 15, surgeMultiplier: 1.2 }
  },
  ola: {
    bike: { basePrice: 12, perKm: 7, surgeMultiplier: 1.0 },
    auto: { basePrice: 22, perKm: 11, surgeMultiplier: 1.1 },
    car: { basePrice: 35, perKm: 14, surgeMultiplier: 1.0 }
  },
  rapido: {
    bike: { basePrice: 10, perKm: 6, surgeMultiplier: 1.0 },
    auto: null, // Rapido doesn't provide auto service
    car: null   // Rapido doesn't provide car service
  }
};

// Calculate estimated distance (mock implementation)
const calculateDistance = (from, to) => {
  // In a real app, use Google Maps API
  const baseDistance = 5; // km
  const variation = Math.random() * 10; // 0-10 km variation
  return Math.max(1, baseDistance + variation);
};

// Calculate estimated time
const calculateTime = (distance, vehicleType) => {
  const speeds = {
    bike: 25,  // km/h
    auto: 20,  // km/h  
    car: 30    // km/h
  };

  const baseTime = (distance / speeds[vehicleType]) * 60; // minutes
  const trafficDelay = Math.random() * 15; // 0-15 minutes
  return Math.round(baseTime + trafficDelay);
};

// Dynamic real-time pricing simulation
const getDynamicPrice = (basePrice, perKm, distance, surgeMultiplier) => {
  const time = new Date().getHours();

  // Peak hours: 8-10 AM and 6-9 PM
  const peakMultiplier = (time >= 8 && time <= 10) || (time >= 18 && time <= 21) ? 1.5 : 1.0;

  // Random traffic factor (slight variation)
  const trafficFactor = 1 + Math.random() * 0.2; // 1.0–1.2

  const price = (basePrice + perKm * distance) * surgeMultiplier * peakMultiplier * trafficFactor;
  return Math.round(price);
};

// Get quote from Uber
const getUberQuote = async ({ from, to, vehicleType }) => {
  try {
    const distance = calculateDistance(from, to);
    const pricing = mockRideData.uber[vehicleType];

    if (!pricing) return null;

    const finalPrice = getDynamicPrice(pricing.basePrice, pricing.perKm, distance, pricing.surgeMultiplier);

    return {
      provider: 'uber',
      vehicleType,
      price: finalPrice,
      estimatedPickupTime: Math.round(3 + Math.random() * 7), // 3-10 minutes
      estimatedTripTime: calculateTime(distance, vehicleType),
      vehicleDetails: {
        type: vehicleType,
        category: vehicleType === 'car' ? 'UberGo' : vehicleType === 'auto' ? 'UberAuto' : 'UberMoto'
      },
      availability: true,
      surge: finalPrice > pricing.basePrice + pricing.perKm * distance
    };
  } catch (error) {
    console.error('Uber API error:', error);
    return null;
  }
};

// Get quote from Ola
const getOlaQuote = async ({ from, to, vehicleType }) => {
  try {
    const distance = calculateDistance(from, to);
    const pricing = mockRideData.ola[vehicleType];

    if (!pricing) return null;

    const finalPrice = getDynamicPrice(pricing.basePrice, pricing.perKm, distance, pricing.surgeMultiplier);

    return {
      provider: 'ola',
      vehicleType,
      price: finalPrice,
      estimatedPickupTime: Math.round(2 + Math.random() * 8), // 2-10 minutes
      estimatedTripTime: calculateTime(distance, vehicleType),
      vehicleDetails: {
        type: vehicleType,
        category: vehicleType === 'car' ? 'Ola Micro' : vehicleType === 'auto' ? 'Ola Auto' : 'Ola Bike'
      },
      availability: Math.random() > 0.1, // 90% availability
      surge: finalPrice > pricing.basePrice + pricing.perKm * distance
    };
  } catch (error) {
    console.error('Ola API error:', error);
    return null;
  }
};

// Get quote from Rapido
const getRapidoQuote = async ({ from, to, vehicleType }) => {
  try {
    if (vehicleType !== 'bike') return null;

    const distance = calculateDistance(from, to);
    const pricing = mockRideData.rapido[vehicleType];

    const finalPrice = getDynamicPrice(pricing.basePrice, pricing.perKm, distance, pricing.surgeMultiplier);

    return {
      provider: 'rapido',
      vehicleType,
      price: finalPrice,
      estimatedPickupTime: Math.round(1 + Math.random() * 5), // 1-6 minutes
      estimatedTripTime: calculateTime(distance, vehicleType),
      vehicleDetails: {
        type: 'bike',
        category: 'Rapido Bike'
      },
      availability: Math.random() > 0.05, // 95% availability
      surge: finalPrice > pricing.basePrice + pricing.perKm * distance
    };
  } catch (error) {
    console.error('Rapido API error:', error);
    return null;
  }
};

// Get quotes from all providers
const getAllQuotes = async ({ from, to, vehicleType }) => {
  const quotes = await Promise.allSettled([
    getUberQuote({ from, to, vehicleType }),
    getOlaQuote({ from, to, vehicleType }),
    getRapidoQuote({ from, to, vehicleType })
  ]);

  return quotes
    .filter(result => result.status === 'fulfilled' && result.value !== null)
    .map(result => result.value);
};

// Price comparison helper
const comparePrices = (quotes) => {
  if (!quotes || quotes.length === 0) return null;

  const sortedByPrice = quotes.sort((a, b) => a.price - b.price);
  return {
    cheapest: sortedByPrice[0],
    mostExpensive: sortedByPrice[sortedByPrice.length - 1],
    averagePrice: Math.round(quotes.reduce((sum, quote) => sum + quote.price, 0) / quotes.length)
  };
};

module.exports = {
  getAllQuotes,
  getUberQuote,
  getOlaQuote,
  getRapidoQuote,
  comparePrices,
  calculateDistance,
  calculateTime
};
