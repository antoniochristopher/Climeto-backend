import express from "express";
import axios from "axios";
import Location from "../models/locationModel.js";

const router = express.Router();

// Fetch current + saved weather data
router.post("/getWeather", async (req, res) => {
  try {
    const { lat, lon } = req.body; // current location
    const apiKey = process.env.WEATHER_API_KEY;

    // Fetch current location weather
    const currentWeatherRes = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
    );

    // Fetch saved locations from DB
    const savedLocations = await Location.find();

    // Fetch weather for all saved locations
    const savedWeatherData = await Promise.all(
      savedLocations.map(async (loc) => {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${loc.lat},${loc.lon}`
        );
        return {
          name: loc.name,
          lat: loc.lat,
          lon: loc.lon,
          weather: response.data,
        };
      })
    );

    res.json({
      current: currentWeatherRes.data,
      saved: savedWeatherData,
    });
  } catch (error) {
    console.error(
      "Weather fetch error:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Failed to fetch weather data" });
  }
});

// Save new searched location
router.post("/saveLocation", async (req, res) => {
  try {
    const { name, lat, lon } = req.body;
    const location = new Location({ name, lat, lon });
    await location.save();
    res.status(201).json({ message: "Location saved" });
  } catch (error) {
    res.status(500).json({ message: "Error saving location:", error });
  }
});

export default router;
