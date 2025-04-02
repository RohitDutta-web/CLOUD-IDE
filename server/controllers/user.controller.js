import User from "../models/user.model.js";

export const register = async (req, res) => {
  try { }
  catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}