const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/User');

router.post("/signup",async (req,res)=>{
    try{
    const{username,email,password}=req.body;
    const existinguser=await User.findOne({email});
    if(existinguser)
        return res.status(400).json({message:"User already Exists!"});
    const encrypt=await bcrypt.genSalt(10);
    const hashedPass=await bcrypt.hash(password,encrypt);
    const newu=new User({username,email,password:hashedPass});
    await newu.save();
    res.status(201).json({message:"User created successfully"});
    
    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }


});
module.exports = router;