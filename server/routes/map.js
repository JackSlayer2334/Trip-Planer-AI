const express = require("express");
const axios = require("axios");
const router = express.Router();

// OpenStreetMap Nominatim search endpoint (FREE)
router.get("/places", async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "jsonv2",
          addressdetails: 1,
          limit: 10,
        },
        headers: {
          "User-Agent": "TripPlannerAI/1.0", // Required by Nominatim
        },
      }
    );

    // Transform Nominatim response to match our expected format
    const places = response.data.map((place) => ({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      place_id: place.place_id,
      type: place.type,
      importance: place.importance,
    }));

    res.json({ results: places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
