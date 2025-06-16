import express from "express";
import { getMostViewedPost } from "../controller/getMostViewedPost.js";

const router = express.Router();

router.get("/most-viewed", getMostViewedPost);

export default router;
