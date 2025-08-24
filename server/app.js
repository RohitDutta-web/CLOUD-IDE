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
import jwt from "jsonwebtoken";
import cookie from "cookie";
import {
  runRoomCode,
  cleanupIdleContainers,
  createUserContainer,
} from "./utils/dockerManager.js";
import { uploadFile, deleteCodeFile } from "./utils/s3.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// 🔌 Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});

const userSocketMap = new Map();

// ✅ Auth middleware for sockets
io.use((socket, next) => {
  const cookies = socket.handshake.headers.cookie;
  if (!cookies) return next(new Error("Authentication token missing"));

  const parsedCookies = cookie.parse(cookies);
  const token = parsedCookies.token;
  if (!token) return next(new Error("Authentication token missing"));

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    socket.userId = verified.id;
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
});

// ✅ Socket handlers
io.on("connection", (socket) => {
  const userId = socket.userId;
  console.log("🔌 User connected:", socket.id, "userId:", userId);

  // Each user gets their private container (if you need that model)
  createUserContainer(userId);

  // --- Room Join ---
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    userSocketMap.set(userId, socket.id);

    io.to(roomId).emit("user-joined", { userId });
    console.log(`👥 User ${userId} joined room ${roomId}`);
  });

  // --- Chat Messages ---
  socket.on("send-message", ({ roomId, message, sender }) => {
    io.to(roomId).emit("receive-message", { message, sender });
  });

  // --- Run Code ---
  socket.on("runCode", async ({ language, roomId, filename, code }) => {
    try {
      console.log(`▶️ Run code: lang=${language}, room=${roomId}`);
      await runRoomCode({ language, roomId, filename, code, io }); // ✅ switched to object
    } catch (err) {
      io.to(roomId).emit("codeOutput", { output: `Error: ${err.message}` });
    }
  });

  // --- Disconnect ---
  socket.on("disconnect", () => {
    for (const [uId, sockId] of userSocketMap) {
      if (sockId === socket.id) {
        userSocketMap.delete(uId);
        console.log(`❌ User ${uId} disconnected`);
        break;
      }
    }
  });
});

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Routes
app.use("/user", userRouter);

// ✅ Cleanup idle containers every 5 min
setInterval(() => {
  cleanupIdleContainers(30);
}, 5 * 60 * 1000);

// ✅ Start server
const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  dbConnection();
});
