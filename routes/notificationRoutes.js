import express from "express";
import { sendPushNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/notify/send", sendPushNotification);

export default router;
