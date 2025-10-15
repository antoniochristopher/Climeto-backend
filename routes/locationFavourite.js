import express from "express";
import Location from "../models/locationModel.js";

const router = express.Router();

router.put("/:id/favourite", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });

    location.favourite = !location.favourite;
    await location.save();

    res.json({
      message: `Location marked as ${
        location.favourite ? "favourite" : "not favourite"
      }`,
      location,
    });
  } catch (error) {
    console.error("Error updating favourite:", error);
    res.status(500).json({ error: "Failed to update favourite status" });
  }
});

export default router;
