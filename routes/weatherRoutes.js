import express from "express";
import { chatWithWeather } from "../controllers/weatherController.js";

const router = express.Router();

router.post("/chat", chatWithWeather);

export default router;
