import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing credentials", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    })

    return res.status(200).json({
      message: "User creation successful",
      success: true,
      username,
      email,
      guest: false,
    })
  }
  catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}

//email validation pending
//nodemailer for server side email verification pending
// use https://blog.openreplay.com/implementing-email-validation-and-verification/

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Missing credentials", success: false
      })
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "user not registered",
        success: false,
      })
    }

    const passwordVerification = bcrypt.verify(password, user.password);
    if (!passwordVerification) {
      return res.status(400).json({
        message: "Wrong credentials",
        success: false
      })
    }

    const tokenData = {
      id: user._id
    }

    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" })

    return res.status(200).cookie("token", token,
      {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',

      }).json({
        message: "login successful",
        success: true,
        user: {
          email: user.email,
          guest: user.guest,
          username: user.username,
        }
      })



  }
  catch (e) {
    return res.status(500).json({
      message: "Internal server issue",
      success: false,
    })
  }
}


export const guestLogIn = async (req, res) => {
  try {
    const { email } = req.body
    let guest = await User.findOne({ email })

    if (!guest) {
      const randomNumber = Math.floor(Math.random() * 100000000);

      let username = `guest${randomNumber}`
      let generatedEmail   = `${username}@guestEmail.com`
      let password = await bcrypt.hash(`guest${randomNumber}`, 10)
      guest = await User.create({
        username,
        email: generatedEmail  ,
        password,
        guest: true,
        createdAt: new Date(),
      })
       

    }


    return res.status(200).json({
      message: "Logged in as a guest",
      success: true,
      guest
    })



  }
  catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    })
  }
}
export const verifyEmail = async (req, res) => {
  try { }
  catch (e) {
    return res.status(500).json({
      message: "Internal server error",
      success: false
    })
  }
}