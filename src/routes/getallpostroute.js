import express from "express";
import {
  getAllPosts,
  getPostById,
  getPostByTitle,
} from "../controller/getpost.js";

const router = express.Router();

router.get("/posts", getAllPosts);
router.get("/posts/title/:title", getPostByTitle);
router.get("/posts/:id", getPostById);
export default router;
