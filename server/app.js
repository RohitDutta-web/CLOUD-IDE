import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { dbConnection } from "./config/db.js";
import bodyParser from "body-parser";
dotenv.config({})
let app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));



const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is live");
  dbConnection();
})