const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library"); 
const Profile = require("../models/user"); 
const client = new OAuth2Client("638475211495-4du0h29g939absn59g3ur5n8ruug3ctl.apps.googleusercontent.com");
router.post("/google-login",async(req,res)=>
{
  try{
    const {credential} = req.body;
    const ticket=await client.verifyIdToken({
      idToken:credential,
      audience:"638475211495-4du0h29g939absn59g3ur5n8ruug3ctl.apps.googleusercontent.com",
    })
    const payload=ticket.getPayload();
    const {name,email,picture}=payload;
    let user=await Profile.findOne({email});
    if(!user)
    {
      user=new Profile({name,email,picture});
      await user.save();
    }
    res.status(200).json({
      message:"Login Successful",
      user,
      user: {
    name: user.name,
    email: user.email,
    picture: user.picture,
  },
    });
  }
  catch(err)
  {
    console.error("Google login error", err);
    res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;
