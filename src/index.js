import express from "express";
import { port } from "./config/dotenv.js";
import { createAdmin } from "./config/Admin.js";
createAdmin();
import router from "./routes/loginroute.js";
import createrouter from "./routes/createpostroute.js";
import getallpost from "./routes/getallpostroute.js";
import cookieParser from "cookie-parser";

const server = express();
server.use(express.json());
server.use(cookieParser());

server.use("/api/auth", router);
server.use("/admin", createrouter);
server.use("/all", getallpost);
server.listen(port, () => {
  console.log(`Server listening on all interfaces`);
});
