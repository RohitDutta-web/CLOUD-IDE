import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing credentials", success: false });
    }
    
    


   }
  catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}