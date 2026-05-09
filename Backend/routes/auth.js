import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router=express.Router();

router.post('/signup',async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }
        const newUser=new User({username,email,password});
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({
            message:"User created successfully",
            token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Error details", error: err.message});
    }
});

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid password"});
        } 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        // user bhejte waqt password exclude kar dein
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Error details", error: err.message});
    }
});


export default router;
