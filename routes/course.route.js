const { Router } = require("express");
const { CourseModel, PurchaseModel } = require("../db/db");
const { authenticateUser } = require("../middleware/user.middleware");
const courseRouter = Router();

// Get all courses
courseRouter.get("/all", async (req, res) => {
    try {
        const courses = await CourseModel.find({}, { title: 1, price: 1, imageLink: 1 });
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get course preview
courseRouter.get("/preview/:courseId", async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.courseId, {
            title: 1,
            description: 1,
            price: 1,
            imageLink: 1
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json({
            ...course.toObject(),
            message: "This is a preview. Purchase the course for full access."
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get course details by ID
courseRouter.get("/:courseId", async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Purchase a course
courseRouter.post("/purchase/:courseId", authenticateUser, async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if user already purchased the course
        const existingPurchase = await PurchaseModel.findOne({
            userID: req.userId,
            courseID: req.params.courseId
        });

        if (existingPurchase) {
            return res.status(400).json({ message: "Course already purchased" });
        }

        // Create new purchase
        await PurchaseModel.create({
            userID: req.userId,
            courseID: req.params.courseId
        });

        res.status(201).json({ message: "Course purchased successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's purchased courses
courseRouter.get("/purchased/all", authenticateUser, async (req, res) => {
    try {
        const purchases = await PurchaseModel.find({ userID: req.userId })
            .populate('courseID');
        res.json(purchases.map(p => p.courseID));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get specific purchased course content
courseRouter.get("/purchased/:courseId", authenticateUser, async (req, res) => {
    try {
        const purchase = await PurchaseModel.findOne({
            userID: req.userId,
            courseID: req.params.courseId
        });

        if (!purchase) {
            return res.status(403).json({ message: "Course not purchased" });
        }

        const course = await CourseModel.findById(req.params.courseId);
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = courseRouter;


