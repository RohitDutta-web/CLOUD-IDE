import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {dbConnection} from "./config/db.js";
dotenv.config({})
let app = express();



const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is live");
  dbConnection();
})