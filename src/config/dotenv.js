import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const port = parseInt(process.env.PORT);
const mongourl = process.env.MONGO_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { port, mongourl, cloudinary };
