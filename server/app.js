import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { dbConnection } from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import http from "http";
import { Server } from "socket.io";
import { log } from "console";
dotenv.config({})
let app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
})

const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log("User connected with socketID " + socket.id);
  
  socket.on("login", (userID) => {
    userSocketMap.set(userID, socket.id);
    console.log(`User ${userID} registered with socket ${socket.id}`);
  })

  socket.on("room-chat", ({ toUserID, message }) => {
    const toSocketID = userSocketMap.get(toUserID);
    if (toSocketID) {
      io.to(toSocketID).emit("private-message", {
        fromUserId: getUserIdBySocketId(socket.id),
        message,
      });
    }
  })

  socket.on("disconnect", () => {
    const disconnectedUserId = getUserIdBySocketId(socket.id);
    if (disconnectedUserId) {
      userSocketMap.delete(disconnectedUserId);
    }
    console.log("User disconnected:", socket.id);
  });

  
  function getUserIdBySocketId(socketId) {
    for (const [userId, sId] of userSocketMap.entries()) {
      if (sId === socketId) return userId;
    }
    return null;
  }
})

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/user", userRouter);



const port = process.env.PORT;
server.listen(port, () => {
  console.log("Server is live");
  dbConnection();
})