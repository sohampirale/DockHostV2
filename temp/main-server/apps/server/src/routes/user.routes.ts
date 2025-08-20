import { Router } from "express";
import User from "../models/user.models.js";
import ApiResponse from "../helpers/ApiResponse.js";
const userRouter = Router();

userRouter.route('/auth/signup')
    .post(async(req,res)=>{

        try {
            const {username,password} = req.body;
            const existingUser = await User.findOne({
                username
            })
    
            if(existingUser){
                return res.status(409).json(new ApiResponse(false,"User already exists with that username"))
            }
    
            const user = await User.create({
                username,
                password
            })
    
            if(user){
                return res.status(200).json(new ApiResponse(true,"User signed up successfully")) 
            }

            return res.status(500).json(new ApiResponse(true,"Failed to create the user")) 
        } catch (error) {
            return res.status(500).json(new ApiResponse(true,"ERROR :: UserSignup : Failed to signup user")) 
        }
    })

userRouter.route('/auth/signin')
    .post(async(req,res)=>{

        try {
            const {username,password} = req.body;
            const existingUser = await User.findOne({
                username
            })
    
            if(!existingUser){
                return res.status(404).json(new ApiResponse(false,"User does not exists with that username"))
            }
            
            if(!await existingUser.comparePassword(password)){
                return res.status(400).json(new ApiResponse(false,"Incorrect Password"))
            }

            return res.status(200).json(new ApiResponse(true,"Signup sucessfull")) 
        } catch (error) {
            return res.status(500).json(new ApiResponse(true,"ERROR :: UserSignin : Failed to Signin")) 
        }
    })