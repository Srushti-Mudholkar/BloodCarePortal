import express from "express";
import userModel from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import Users from "../models/userModel.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { email } from "zod";

// dot config
dotenv.config();

export const registerContrroller = async(req,res) => {
  try {
    const existingUser = await userModel.findOne({ email:req.body.email })
    // validation
    if(existingUser){
        return res.status(200).send({
            success : false,
            message : 'User already exists'
        })
    }
    // hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    req.body.password = hashedPassword;
    // rest data
    const user = new userModel(req.body);
    await user.save();
    return res.status(201).send({
        success:"User Registered successfully",
        user
    })
  } catch (e) {
    console.log(e);
    res.status(500).send({
        success : false,
        message : 'Error in Register API',
        e
    })
  }
};

// login controller

export const loginContrroller = async(req,res) => {
  try{
    const user = await userModel.findOne({ email: req.body.email });
    if(!user){
      return res.status(404).send({
        success : false,
        message : 'User not found'
      })
    }
    // compare password
    const comparePassword = await bcrypt.compare(req.body.password, user.password);
    if(!comparePassword){
      return res.status(500).send({
      success : false,
      message : 'Invalid Crendentials'
    })
  }
   const secretKey = process.env.JWT_SECRET; 
    const token = jwt.sign({userId: user._id},secretKey,{expiresIn:'1d'});
    return res.status(200).send({
      success : true,
      message : 'Login successfully',
      token,
      user
    })
  } catch (e){
      console.log(e);
      res.status(500).send({
        success : false,
        message: 'Error in Login API',
        e
      })
  }
}

// GET CURRENT USER
export const currentUserController = async(req,res) => {
    try {
      const user = await userModel.findOne({email:req.body.email});
      return res.status(200).send({
        success : true,
        message : 'User fetched successfully',
        user
      })
    } catch (e) {
        console.log(e);
       return res.status(500).send({
         success : false,
         message : 'unable to get current user',
         e
       })
    }
}