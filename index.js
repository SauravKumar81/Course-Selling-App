const express =require('express');
const userRouter = require("./routes/user.route");
const courseRouter = require("./routes/course.route");
const adminRouter = require("./routes/admin.route");
const mongoose = require("mongoose");

require('dotenv').config();


const  app = express();

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);

async function connectToDB(){
    await mongoose.connect(process.env.mongo_uri);
    app.listen(3000,()=>{
    console.log("server is running on port 3000");
});
}

connectToDB();