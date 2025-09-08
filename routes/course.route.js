const {Router} = require("express");

const courseRouter = Router();

courseRouter.get("/",(req,res)=>{
    res.send("All courses");
});

courseRouter.post("/create",(req,res)=>{
    res.send("Course created");
});

courseRouter.get("/:courseId",(req,res)=>{
    res.send(`Course details of ${req.params.courseId}`);
});

courseRouter.put("/:courseId/update",(req,res)=>{
    res.send(`Course ${req.params.courseId} updated`);
});

courseRouter.delete("/:courseId/delete",(req,res)=>{
    res.send(`Course ${req.params.courseId} deleted`);
});

module.exports = courseRouter;


