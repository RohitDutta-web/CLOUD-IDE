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
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.index({ email: 1 })

const User = mongoose.model("User", userSchema)
export default User;