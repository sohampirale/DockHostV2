import type { Request, Response } from "express";
import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import handleApiError from "../helpers/handleApiError.js";
import { generateBackendAccessToken, generateUserAccessToken } from "../helpers/token.js";
import Instance from "../models/backend.model.js";
import Backend from "../models/backend.model.js";

export async function signupBackendController(req:Request,res:Response){
  try {
    const {username,password,labName,opearatingSystem,maxContainers}=req.body;

    const existingInstance=await Instance.findOne({
      username
    })

    if(existingInstance){
      throw new ApiError(409,"Instance with that username already exists")
    }

    const backend = await Backend.create({
      username,
      password,
      labName,
      opearatingSystem,
      maxContainers
    })

    if(!backend){
      throw new ApiError(500,"Failed to register the backend")
    }

    const payload={
      _id:instance._id,
      username:instance.username
    }
    
    const DOCKHOST_API_KEY = generateBackendAccessToken(payload)
    backend.API_KEY=DOCKHOST_API_KEY;
    await backend.save()

    return res
      .cookie("accessTokenBE", DOCKHOST_API_KEY, {
        httpOnly: true,       
        secure: true,
        sameSite: "none"
      })
      .status(201)
      .json(
        new ApiResponse(true,"Instance signed up successfully",{
          DOCKHOST_API_KEY
        })
      )

  } catch (error) {
    return handleApiError(res,error)
  }
}

export async function signinBackendController(req:Request,res:Response){
    const { username, password } = req.body;
    try {
      const existingBackend = await Instance.findOne({
        username
      })

      if (!existingBackend) {
        throw new ApiError(404, "Instance not found with given username")
      } else if (!await existingBackend.comparePassword(password)) {
        throw new ApiError(400, "Incorrect password")
      }
      
      let DOCKHOST_API_KEY = existingBackend.API_KEY
      
      if(!DOCKHOST_API_KEY){
        const payload = {
          _id: existingBackend._id,
          username: existingBackend.username,
        }
        DOCKHOST_API_KEY=generateBackendAccessToken(payload);
        existingBackend.API_KEY=DOCKHOST_API_KEY;
        await existingBackend.save()

        return res.status(200)
        .cookie("accessTokenBE", DOCKHOST_API_KEY, {
          httpOnly: true,       
          secure: true,
          sameSite: "none"
        })
        .json(new ApiResponse(true, "Login successfully",{
          DOCKHOST_API_KEY
        }))
      }

      console.log('login successfull');
      
      return res.status(200)
        .json(new ApiResponse(true, "Login successfully",{
          DOCKHOST_API_KEY
        }))

    } catch (error: unknown) {
      return handleApiError(res, error)
    }
}