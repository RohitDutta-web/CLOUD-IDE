import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing credentials", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
      guest: false,
    })

    return res.status(200).json({
      message: "User creation successful",
      success: true,
      username,
      email,
      guest: false,
    })
  }
  catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

//email validation pending
//nodemailer for server side email verification pending
// use https://blog.openreplay.com/implementing-email-validation-and-verification/

export const logIn = async (req, res) => {
  try { }
  catch (e) {
    return res.status(500).json({
      message: "Internal server issue",
      success: false,
    })
  }
}

export const verifyEmail = async (req, res) => {
  try { }
  catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}