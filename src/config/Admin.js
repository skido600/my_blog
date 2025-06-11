import bcrypt from "bcrypt";
import User from "../models/user.js";
import { dbconnect } from "./dbconnect.js";
async function createAdmin() {
  try {
    await dbconnect();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Admin already exists.");
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const role = "Admin";
    const newUser = new User({ email, password: passwordHash, role: role });
    await newUser.save();

    console.log("Admin created!");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

export { createAdmin };
