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

dotenv.config({})
let app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: '*'
})

const userSocketMap = new Map();

io.on('connection', (socket) => {
  console.log("User connected with socketID " + socket.id);

  socket.on("join-room", (roomId, userID) => {
    socket.join(roomId)
    userSocketMap.set(userID, socket.id);
    socket.to(roomId).emit('user-joined', { userID });
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