import express from "express";
import Location from "../models/locationModel.js";

const router = express.Router();

// Delete a location by ID
router.delete("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    await Location.findByIdAndDelete(req.params.id);

    res.json({
      message: "Location deleted successfully",
      deletedId: req.params.id,
    });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

export default router;
