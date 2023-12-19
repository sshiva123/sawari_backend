const express = require('express');
const router = express.Router();
const User=require('../models/user');
const bcrypt=require('bcrypt')
const jwt = require("jsonwebtoken");
router.post('/login',async(req,res)=>{
    try {
        
        const {username,password,email}=req.body;
        const user=await User.findOne({ email });
        if(!user){
            return res.status(404).json({message:"Not found"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Incorrect Password"});
            
        }
        const userDetail={
            _id:user._id,
            username:user.username,
            email:user.email,
            contact:user.contact
          };
        const token = jwt.sign(userDetail, process.env.JWT_SECRET, {
            expiresIn: 86400,
          });
        res.status(200).json({user:userDetail,token,message:"Success"});
    } catch (error) {
        res.status(500).json({message:"Something went wrong!"});
    }
});
// Route to create a new user i.e. register
router.post('/register', async (req, res) => {
    try {
    const {username,email,contact="",password}=req.body;
    const uniqueTest=await User.findOne({$or:[{email:email},{username:username}]});
    if(uniqueTest){
        return res.status(401).json({message:"Username/email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username: username,
        email: email,
        contact: contact,
        password: hashedPassword,
    });
    const result = await newUser.save();
    res.status(201).json({message:"Success"});
    } catch (error) {
    res.status(500).json({ message: 'Failed to create new user', error });
    }
});
module.exports=router;