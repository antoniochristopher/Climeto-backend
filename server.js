import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import userReg from "./routes/userReg.js";
import locationFavourite from "./routes/locationFavourite.js";
import locationDelete from "./routes/locationDelete.js";
import locationFetch from "./routes/locationFetch.js";
import locationSearch from "./routes/locationSearch.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/userReg", userReg);
app.use("/api/locationFetch", locationFetch);
app.use("/api/locationFavourite", locationFavourite);
app.use("/api/locationDelete", locationDelete);
app.use("/api/locationSearch", locationSearch);

// Base route
app.get("/", (req, res) => {
  res.send("Climateo API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
