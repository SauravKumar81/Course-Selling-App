const {Router} = require("express");

const adminRouter = Router();

adminRouter.get("/",(req,res)=>{
    res.send("Admin dashboard");
});

adminRouter.post("/create-user",(req,res)=>{
    res.send("Admin created a user");
});

adminRouter.get("/users",(req,res)=>{
    res.send("List of all users");
});

adminRouter.put("/update-user/:userId",(req,res)=>{
    res.send(`Admin updated user ${req.params.userId}`);
});

adminRouter.delete("/delete-user/:userId",(req,res)=>{
    res.send(`Admin deleted user ${req.params.userId}`);
});

module.exports = adminRouter;