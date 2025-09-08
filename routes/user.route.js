const {Router} = require("express");
const userRouter = Router();

userRouter.post("/register",(req,res)=>{
    res.send("user registered");
});

userRouter.post("/login",(req,res)=>{
    res.send("user logged in");
});


















module.exports = userRouter;