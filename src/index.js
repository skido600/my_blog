import express from "express";
import { port } from "./config/dotenv.js";
import { createAdmin } from "./config/Admin.js";
createAdmin();
import router from "./routes/loginroute.js";
import createrouter from "./routes/createpostroute.js";
import getallpost from "./routes/getallpostroute.js";
import cookieParser from "cookie-parser";
import cronjob from "./config/cronjob.js";
import cronroute from "./routes/keepAlive.js";
import cors from "cors";

const server = express();
server.use(express.json());
server.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  "https://leoblog-seven.vercel.app",
];

server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked CORS for:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

server.use("/api/auth", router);
server.use("/api", cronroute);
server.use("/admin", createrouter);
server.use("/all", getallpost);

server.listen(port, () => {
  cronjob();
  console.log(`Server listening on all ${port}`);
});
