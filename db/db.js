const mongoose = require("mongoose");
console.log("connecting to db");

const Schema = mongoose.Schema;
const ObjectID = mongoose.Types.ObjectId;


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    }
});


const courseSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageLink:{
        type:String,
        required:true
    },
    creatorID:ObjectID
})
const adminSchema = new Schema ({
      email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    }
})


const purchaseSchema = new Schema({
    userID:ObjectID,
    courseID:ObjectID
});


const UserModel = mongoose.model("User",userSchema);
const CourseModel = mongoose.model("Course",courseSchema);
const AdminModel = mongoose.model("Admin",adminSchema);
const PurchaseModel = mongoose.model("Purchase",purchaseSchema);

module.exports = {
    UserModel,
    CourseModel,
    AdminModel,
    PurchaseModel

} 