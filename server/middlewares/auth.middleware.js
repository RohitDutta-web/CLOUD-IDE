import jwt from "jsonwebtoken";

const userAuthentication = async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) {
      return res.status(400).json({
        message: "Please login first",
        success: false
      })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.id = decoded.id
    next();

   }
  catch (e) {
    return res.status(500).json({
      message: "Auth server issue",
      success: false
    })
  }
 }

export default userAuthentication;