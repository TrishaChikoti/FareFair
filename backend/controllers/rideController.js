const { getAllQuotes, comparePrices } = require('../utils/rideProviders');

exports.getQuotes = async (req, res) => {
  try {
    const { from, to, vehicleType } = req.body;

    const quotes = await getAllQuotes({ from, to, vehicleType });
    const comparison = comparePrices(quotes);

    res.json({
      success: true,
      quotes,
      comparison
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    res.status(500).json({ success: false, message: "Failed to fetch ride quotes" });
  }
};
