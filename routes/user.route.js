const { Router } = require("express");
const userRouter = Router();
const { z } = require("zod");
const { UserModel } = require("../db/db");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const { authenticateUser } = require('../middleware/user.middleware');
require("dotenv").config();



const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
});

userRouter.post("/signup", async function(req, res) {
    try {   
    const { email, password, firstName, lastName } = signupSchema.parse(
      req.body
    );

    const user = await UserModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    });

    res.status(201).json({
        message: "User registered successfully",
        userId: user._id
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: error.errors.map((e) => ({
          field: e.path[0],
          message: e.message,
        })),
      });
    }
   
    
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("Attempting to find user with email:", email);
    const user = await UserModel.findOne({ 
      email: email, 
      password: password 
    });

    if (user) {
      const token = jwt.sign({
        id: user._id
      }, process.env.JWT_SECRET);

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      res.json({
        message: "Successfully signed in",
        userId: user._id
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials"
      });
    }
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      message: error.message || "Internal server error"
    });
  }
});

userRouter.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

userRouter.post("/logout", authenticateUser, (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully" });
});

module.exports = userRouter;
