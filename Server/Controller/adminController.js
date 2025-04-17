const adminModel=require("../Models/adminModel");
const bcrypt=require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin=async (req,res)=>{
    try {
        const {userId,password}=req.body;

        const admin=await adminModel.findOne({userId});
        
        if(!admin){
            return res.json({message:"admin not found."})
        }
        const isMatch = password === admin.password;

        if(!isMatch){
            return res.json({message:"invalid password."})
        }
        console.log(process.env.SECRET_KEY);
        const token=await jwt.sign({id:userId},process.env.SECRET_KEY,{expiresIn:"1hr"});
        res.status(200).json({message:"admin logged in successfully",token:token});
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:error.message});
    }
}
module.exports={adminLogin}