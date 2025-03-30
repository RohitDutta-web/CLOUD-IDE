import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config({})


const mongoUri = process.env.MONGO_URI;
export const  dbConnection = async () => {
  try {
    await mongoose.connect(mongoUri).then(console.log("Database connection complete"));

  }
  catch (e) {
    console.log(e.response.data);

  }
}