import { register, logIn, guestLogIn, updateUser, verifyEmail, sentVerificationMail, logOut, gitHub, linkedIn } from "../controllers/user.controller.js";
import userAuthentication from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/register", register);
router.post("/logIn", logIn);
router.post("guest/logIn", guestLogIn);
router.put("/update", userAuthentication,  updateUser);
router.get("/verification", userAuthentication, sentVerificationMail);
router.get("/emailVerification/:id", verifyEmail);
router.get("/logOut", userAuthentication, logOut);
router.post("/gitHub", userAuthentication, gitHub);
router.post("/linkedIn", userAuthentication, linkedIn);


export default router;