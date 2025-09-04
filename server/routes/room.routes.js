import { createRoom, joinRoom, exitRoom } from "../controllers/room.controller.js";
import userAuthentication from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/createRoom", userAuthentication, createRoom);
router.post("/joinRoom", userAuthentication, joinRoom);
router.get("exitRoom", userAuthentication, exitRoom);


export default router;

