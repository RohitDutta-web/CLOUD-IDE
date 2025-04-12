import { register, logIn, guestLogIn, updateUser, verifyEmail, sentVerificationMail, logOut } from "../controllers/user.controller.js";
import userAuthentication from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/logIn", logIn);
router.post("guest/logIn", guestLogIn);
router.put("/update", userAuthentication,  updateUser);
router.get("/verification", userAuthentication, sentVerificationMail);
router.get("/emailVerification", userAuthentication, verifyEmail);
router.get("/logOut", userAuthentication, logOut);


export default router;