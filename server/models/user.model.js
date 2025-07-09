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
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  gitHub: {
    type: String,
  },
  linkedIn: {
    type: String
  }
}, { timestamps: true })

userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400, partialFilterExpression: { guest: true } })

const User = mongoose.model("User", userSchema)
export default User;