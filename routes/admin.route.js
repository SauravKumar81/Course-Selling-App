const { Router } = require("express");
const { AdminModel, CourseModel, UserModel } = require("../db/db");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { authenticateAdmin } = require('../middleware/admin.middleware');
const adminRouter = Router();

// Validation schemas
const adminSignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2)
});

const courseSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    imageLink: z.string().url()
});



// Admin Auth Routes
adminRouter.post("/signup", async (req, res) => {
    try {
        const { email, password, firstName, lastName } = adminSignupSchema.parse(req.body);
        
        const admin = await AdminModel.create({
            email, password, firstName, lastName
        });

        res.status(201).json({
            message: "Admin registered successfully",
            adminId: admin._id
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
});

adminRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await AdminModel.findOne({ email, password });

        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: admin._id }, process.env.ADMIN_JWT_SECRET);
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ message: "Admin signed in successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Course Management Routes
adminRouter.post("/courses", authenticateAdmin, async (req, res) => {
    try {
        const courseData = courseSchema.parse(req.body);
        const course = await CourseModel.create({
            ...courseData,
            creatorID: req.adminId
        });
        res.status(201).json(course);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
});

adminRouter.get("/courses", authenticateAdmin, async (req, res) => {
    try {
        const courses = await CourseModel.find({ creatorID: req.adminId });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.put("/courses/:courseId", authenticateAdmin, async (req, res) => {
    try {
        const course = await CourseModel.findOneAndUpdate(
            { _id: req.params.courseId, creatorID: req.adminId },
            req.body,
            { new: true }
        );
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.delete("/courses/:courseId", authenticateAdmin, async (req, res) => {
    try {
        const course = await CourseModel.findOneAndDelete({
            _id: req.params.courseId,
            creatorID: req.adminId
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Management Routes
adminRouter.get("/users", authenticateAdmin, async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.get("/users/:userId", authenticateAdmin, async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId, { password: 0 });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.delete("/users/:userId", authenticateAdmin, async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = adminRouter;