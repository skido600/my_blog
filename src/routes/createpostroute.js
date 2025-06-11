import express from "express";

import {
  postcontroller,
  updatePostController,
  deletePostController,
} from "../controller/Postcontroller.js";
import authenticate from "../middlewares/verify.js";
const router = express.Router();

router.post("/create", authenticate, postcontroller);
router.put("/create/:id", authenticate, updatePostController);
router.delete("/create/:id", authenticate, deletePostController);
export default router;
