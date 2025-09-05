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
      return res.status(400).json({ message: "Please login first", success: false })
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
      room,
      userName: user.username
    })
  }
  catch (e) {
    return res.status(400).json({
      message: "Internal server issue",
      success: false
    })
  }
}


//joining room 
export const joinRoom = async (req, res) => {
  try {
    const userId = req.id;
    const { roomId } = req.body;

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
        success: false
      })
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(400).json({
        message: "Invalid room id",
        success: false
      })
    }

    if (!room.users.includes(user._id)) {
      room.users.push(user._id);
    }

    await room.save();



    return res.status(200).json({
      message: "Room joined",
      success: true
    })



  }
  catch (e) {
    return res.status(400).json({
      message: e.message || "Something went wrong",
      success: false
    })
  }
}


//exiting room
export const exitRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.id;

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({
        message: "Invalid user",
        success: false
      })
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(400).json({
        message: "Invalid room id",
        success: false
      })
    }

    if (room.users.includes(user._id)) {
      room.users = room.users.filter(
        (u) => u.toString() !== userId.toString()
      );
      await room.save();
    }


    return res.status(200).json({
      message: "Exited from room",
      success: true
    })


  }
  catch (e) {
    return res.status(400).json({
      message: e.message || "Something went wrong",
      success: false
    })
  }
}
