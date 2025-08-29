import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register a new user (with password hashing)
export const register = async (req, res) => {
  try {
    // Check if required fields are provided
    const { username, email, password, photo } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10); // generate salt
    const hashedPassword = await bcrypt.hash(password, salt); // hash password

    const newUser = new User({
      username,
      email,
      password: hashedPassword,  // Store the hashed password
      photo
    });

    await newUser.save();
    res.status(200).json({ success: true, message: "User registered successfully", user: newUser });

  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(500).json({ success: false, message: "Error registering user, Try Again.", error });
  }
};

// User login (password comparison using bcrypt)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email & password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Important: ensure both are strings for bcryptjs
    const ok = await bcrypt.compare(String(password), String(user.password));
    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    const { password: _p, ...safeUser } = user.toObject();

    res
      .cookie("accesstoken", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, message: "Login successful", token, data: safeUser, role: user.role });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Error logging in user, Try Again.", error: err.message });
  }
};

