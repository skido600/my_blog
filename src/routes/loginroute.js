import express from "express";
import { login, logout } from "../controller/authcontrollers.js";
import authenticate from "../middlewares/verify.js";
const router = express.Router();

// POST /api/login
router.post("/login", login);
router.post("/logout", authenticate, logout);

export default router;
