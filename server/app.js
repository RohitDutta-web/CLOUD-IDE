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
import { createRoomContainer, createUSerContainer } from "./utils/dockerManager.js";
import jwt from "jsonwebtoken";
import cookie from 'cookie';
import pty from "node-pty";
import os from "os";



dotenv.config({})
let app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: '*'
})

const userSocketMap = new Map();

io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(new Error("Authentication token missing"));

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;


  if (!token) {
    return next(new Error("Authentication token missing"));
  }

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = verified.id; 
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
});

io.on('connection', (socket) => {

  const userId = socket.userId;
  createUSerContainer(userId);
  console.log("User connected with socketID " + socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId)
    createRoomContainer(roomId)
    userSocketMap.set(userId, socket.id);
    socket.to(roomId).emit('user-joined', { userId });
  })

   socket.on('send-message', ({ roomId, message, sender }) => {
    io.to(roomId).emit('receive-message', { message, sender });
  });

  
  socket.on('disconnect', () => {
    for (const [userId, sockId] of userSocketMap) {
      if (sockId === socket.id) {
        userSocketMap.delete(userId);
        console.log(`${userId} disconnected`);
        break;
      }
    }})


 
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