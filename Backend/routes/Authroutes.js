const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const User=require('../models/User');

router.post("/signup",async (req,res)=>{
    try{
        console.log("Signup route hit");          
  console.log("Request body:", req.body);
    const{username,email,password}=req.body;
    const existinguser=await User.findOne({email});
    if(existinguser)
        return res.status(400).json({message:"User already Exists!"});
    const encrypt=await bcrypt.genSalt(10);
    const hashedPass=await bcrypt.hash(password,encrypt);
    const newu=new User({username,email,password:hashedPass});
    // try {
    await newu.save();
    // console.log("User saved successfully:", newu);
    // } catch (err) {
    // console.error("Error saving user:", err.message);
    // }
    res.status(201).json({message:"User created successfully"});
    
    }
    catch(error){
        res.status(500).json({message:"Server error"});
    }


});

router.post("/login",async (req,res)=>{
    
    try{
        const{email,password}=req.body;
    const existuser=await User.findOne({email});
    if(!existuser)
        return res.status(400).json({message:"user not found!"});
    const Matched = await bcrypt.compare(password,existuser.password);
        if (!Matched) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign(
            { id: existuser._id, email: existuser.email },
            process.env.JWT_SECRET || "secretKey", 
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: existuser._id,
                username: existuser.username,
                email: existuser.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

});
module.exports = router;