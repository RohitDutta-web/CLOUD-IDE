import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  guest: {
    type: Boolean,
    required: true,
    default: false,
  }
})


const User = mongoose.model("User", userSchema)
export default User