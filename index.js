const express =require('express');
const userRouter = require("./routes/user.route");
const courseRouter = require("./routes/course.route");
const adminRouter = require("./routes/admin.route");
const db = require("./db/db");

const  app = express();

app.use("/api/v1/user",userRouter);
app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/course",courseRouter);

app.listen(3000,()=>{
    console.log("server is running on port 3000");
})