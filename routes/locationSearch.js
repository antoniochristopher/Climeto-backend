import express from "express";
import axios from "axios";
import Location from "../models/locationModel.js";

const router = express.Router();

// Search location, save it, and fetch weather
router.post("/search", async (req, res) => {
  try {
    const { name } = req.body;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!name) {
      return res.status(400).json({ error: "Location name is required" });
    }

    // Fetch weather info by location name
    const weatherRes = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(
        name
      )}`
    );

    const weatherData = weatherRes.data;

    // Extract lat/lon from response
    const lat = weatherData.location.lat;
    const lon = weatherData.location.lon;

    // Check if location already exists in DB
    let location = await Location.findOne({ name: weatherData.location.name });
    if (!location) {
      // Save new location
      location = new Location({ name: weatherData.location.name, lat, lon });
      await location.save();
    }

    // Respond with weather and DB save info
    res.status(200).json({
      message: location.isNew
        ? "Location saved and weather fetched"
        : "Location already exists, weather fetched",
      location: {
        id: location._id,
        name: location.name,
        lat,
        lon,
      },
      weather: weatherData,
    });
  } catch (error) {
    console.error(
      "Error searching location:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Failed to search location and fetch weather" });
  }
});

export default router;
