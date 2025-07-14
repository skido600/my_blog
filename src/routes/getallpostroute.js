import express from "express";
import {
  getAllPosts,
  getPostById,
  getPostByTitle,
  getFeaturedPosts,
  GetbySlug,
} from "../controller/getpost.js";

const router = express.Router();

router.get("/posts", getAllPosts);
router.get("/posts/title/:title", getPostByTitle);
router.get("/posts/:id", getPostById);
router.get("/post/featured", getFeaturedPosts);
router.get("/post/:slug", GetbySlug);
export default router;
