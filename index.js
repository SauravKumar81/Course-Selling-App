const express = require('express');
const userRouter = require("./routes/user.route");
const courseRouter = require("./routes/course.route");
const adminRouter = require("./routes/admin.route");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

app.use(cookieParser());

app.use(express.json());

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);

async function connectToDB(){
    try {
        await mongoose.connect(process.env.mongo_uri);
        console.log("Successfully connected to MongoDB");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

connectToDB();