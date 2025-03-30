import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({})
let app = express();



const port = process.env.PORT;
app.listen(port, () => {
  console.log("Server is live");
})