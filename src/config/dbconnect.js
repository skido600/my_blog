import mongoose from "mongoose";
import { mongourl } from "./dotenv.js";

const dbconnect = async () => {
  try {
    const connect = await mongoose.connect(mongourl);
    console.log("Database connected:", connect.connection.name);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export { dbconnect };
