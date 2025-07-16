const express=require("express");
const router=express.Router();
const User=require("../models/user");
router.post("/update",async (req,res)=>{
try{
    const{id}=req.body;
    const user=await User.findById(id);
    if(!user)
    {
        return res.status(404).json({message:"user Not found,Kindly create an profile in our website to continue!"})
    }
    const today=new Date().toDateString();
    const lastactive=user.lastActiveDate? new Date(user.lastActiveDate).toDateString():null;
    if(lastactive===today)
    {
        return res.status(200).json({message:"Steak already submitted for Today!"})
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = lastActive === yesterday.toDateString();

    user.streak = isYesterday ? user.streak + 1 : 1;
    user.lastActiveDate = new Date();
}catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }

});
module.exports = router;