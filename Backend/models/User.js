const mongoose=require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        unique:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String
    },
    name:{
        type:String,
        required:false,
        unique:false
    },
    streakCount: {
        type: Number,
        default: 0
    },
    lastStreakUpdate: {
        type: String,
        default: null
    }
});
const User=mongoose.model('User',userSchema);
module.exports=User;