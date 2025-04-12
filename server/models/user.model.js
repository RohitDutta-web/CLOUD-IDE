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
  createdAt: {
    type: Date,
    default: undefined
  },
  emailVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true })

userSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 })

const User = mongoose.model("User", userSchema)
export default User;