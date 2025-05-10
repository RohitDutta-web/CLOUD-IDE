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

io.on('connection', (socket) => {
  console.log("Socket connected " + socket.id);
  

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data); 
  });

  socket.on('disconnect', () => {
    console.log("User disconnected");
  })
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