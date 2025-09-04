import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import { createRoomContainer } from "../utils/dockerManager.js";


//creating room along with its container and enabling with socket
export const createRoom = async (req, res) => {
  try { 
    const { roomId } = req.body;
    if (!roomId) {
      return res.status(400).json({ message: "provide a valid room id", success: false });
    }
    const userId = req.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "Please login first" , success: false})
    }
    
    const container = await createRoomContainer(roomId);
    let existingRoom = await Room.findOne({ roomId })
    
    if (existingRoom) {
      return res.status(400).json({
        message: "Room already running",
        success: false
      })
    }


    let room = await Room.create({
      roomId,
      owner: userId,
      users: [userId],
      containerId: container.id
    })


    return res.status(200).json({
      message: "Room created",
      success: true,
      room
    })
  }
  catch (e) {
    return res.status(400).json({
      message: e.message || "Something went wrong",
      success: false
    })
  }
}


//joining room 
export const joinRoom = async (req, res) => {
  try {
    
   }
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
