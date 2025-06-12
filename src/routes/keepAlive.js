import express from "express";
import { cronjob } from "../controller/cronjob.js";

const routes = express.Router();

routes.get("/keep-alive", cronjob);

export default routes;
