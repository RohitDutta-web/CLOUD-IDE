import Room from "../models/room.model.js";


//creating room along with its container and enabling with socket
export const createRoom = async (req, res) => {
  try { }
  catch (e) {
    return res.status(400).json({
      message: e.message || "Something went wrong",
      success: false
    })
  }
}


//joining room 
export const joinRoom = async (req, res) => {
  try { }
  catch (e) {
    return res.status(400).json({
      message: e.message || "Something went wrong",
      success: false
    })
  }
}


//delete room and its container after being idle or auto delete if no user presents
export const deleteRoom = async (req, res) => {
  try { }
  catch (e) {
    return res.status(400).json({
      message: e.message || "Something went wrong",
      success: false
    })
  }
}
