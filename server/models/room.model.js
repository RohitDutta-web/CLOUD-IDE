import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomId: { //will receive through client
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //tracking all joined users
  containerId: { //connect to container when start
    type: String,
    required: true
  },
  code: {
    type: String
  },
},

  {
    timestamps: true // to track time and activity
  })

const Room = mongoose.model("Room", roomSchema)

export default Room;
