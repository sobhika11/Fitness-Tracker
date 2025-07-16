const express=require("express");
const router=express.Router();
const User=require("../models/user");
router.post("/update",async (req,res)=>{
try{
    const { id, meals } = req.body;
    const user=await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User Not found. Kindly create a profile on our website to continue!" });
    }
    const { breakfast, lunch, dinner } = meals || {};
    if (!breakfast || !lunch || !dinner) {
        return res.status(400).json({ message: "Complete all 3 meals to update your streak!" });
    }
    const today=new Date().toDateString();
    const lastActive=user.lastActiveDate? new Date(user.lastActiveDate).toDateString():null;
    if(lastActive===today)
    {
        return res.status(200).json({message:"Steak already submitted for Today!"})
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = lastActive === yesterday.toDateString();

    user.streak = isYesterday ? user.streak + 1 : 1;
    user.lastActiveDate = new Date();
    await user.save();
    return res.status(200).json({message:"Streak Updated!",streak:user.streak});

}catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }

});
module.exports = router;