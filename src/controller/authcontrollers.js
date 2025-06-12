import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { Loginschema } from "../config/validate.js";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error, value } = Loginschema.validate({ email, password });

    if (error) {
      return res
        .status(401)
        .json({ success: false, message: error.details[0].message });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "LOL! Are you sure you're the admin or just an imposter?",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password password" });
    }

    const token = jwt.sign(
      { userid: user._id, email: user.email, role: user.role },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "3d",
      }
    );
    res.cookie("Authorization", `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { login };
