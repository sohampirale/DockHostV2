import type { Request, Response } from "express";
import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import handleApiError from "../helpers/handleApiError.js";
import { generateUserAccessToken } from "../helpers/token.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { MAX_CLIENT_WAITING_TIME, maxNoOfInstancesPerUser } from "../constants/index.js";
import { activeBackends } from "../index.js";
import { asyncSocketAwaiter, checkIfInstanceExists } from "../helpers/user.helpers.js";
import Instance from "../models/instance.model.js";

export async function userSignupController(req: Request, res: Response) {

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{
        username
      }, {
        email
      }]
    })

    if (existingUser) {
      throw new ApiError(409, "User already exists with requested email or username")
    }

    const user = await User.create({
      username,
      email,
      password
    })

    if (!user) {
      throw new ApiError(500, "Failed to create the user")
    }

    const payload = {
      _id: user._id,
      username: user.username,
      email: user.email,
      instances: user.instances
    }

    const accessToken = generateUserAccessToken(payload);
    console.log('signup successful token : ', accessToken);

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      })
      .status(201)
      .json(
        new ApiResponse(true, "User created successfully")
      )

  } catch (error: unknown) {
    return handleApiError(res, error)
  }
}

export async function userSigninController(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({
      username
    })

    if (!existingUser) {
      throw new ApiError(404, "User not found")
    } else if (!await existingUser.comparePassword(password)) {
      throw new ApiError(400, "Incorrect password")
    }

    const paylod = {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
    }

    const accessToken = generateUserAccessToken(paylod)

    console.log('login successfull of ', username);
    console.log('accessToken : ',accessToken);
    
    return res.status(200)
      .cookie("accessToken", accessToken)
      .json(new ApiResponse(true, "Login successfully"))

  } catch (error: unknown) {
    return handleApiError(res, error)
  }
}

//I like to add comments think about what i am going to write and then write backend code so...

/**         Create an instance
 * 1.authMIddleware req.data from decoding jwt -> route handler
 * 2.check no of instances of user if it exceeds the allowed limit then reject
 * 3.check no of active pc's
 * 4.ask one by one each active backend do you have already have a docker container with that USERNAME
 * 5.if found any without having any docker container for that USERNAME tell that backend to "start_container"
 * 6.if all already have runnign container reject insufficient no of backends availaible to start new instance
 */

export async function createNewInstanceController(req:Request,res:Response) {
  console.log('inside createNewInstanceController');
  
  const userData = req.data;
  const { SSH_PUB_KEY } = req.body;
  console.log('userData : ',userData);
  
  try {

    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userData._id)
        }
      }, {
        $lookup: {
          from: "instances",
          localField: '_id',
          foreignField: "userId",
          as: "instances"
        }
      }
    ])

    console.log('fetched user : ',user);

    
    if (user.length == 0) {
      return res.status(404).json(
        new ApiResponse(false, "User not found")
      )
    } else if (maxNoOfInstancesPerUser!=0) {
      const noOfInstancesOfUser = user[0].instances.length
      console.log('heyy');
      if (noOfInstancesOfUser > maxNoOfInstancesPerUser) {
        
        return res.status(400).json(
          new ApiResponse(false, "You have reached max no of instances limit, delete existing instances to spawn new")
        )
      }

    }

    const USERNAME = user[0].username
    console.log('USERNAME : ',USERNAME);
    
    if (activeBackends.size == 0) {
      return res.status(500).json(
        new ApiResponse(false, "No active backends right now,start one")
      )
    }

    for (const [key, value] of activeBackends) {
      console.log("Key:", key, "Value:", value);

      const exists = await checkIfInstanceExists(value.socket, USERNAME);
      if (!exists) {
        value.socket.emit('start_container', {
          SSH_PUB_KEY,
          USERNAME
        })

        let timeout = false;

        const timeoutId=setTimeout(() => {
          timeout = true;
          return res.status(500).json(
            new ApiResponse(false, "Response timeout, please wait while your request is being processed")
          )
        }, MAX_CLIENT_WAITING_TIME)

        console.log('awaiting response from backend : ',value.backendInfo.username);

        await asyncSocketAwaiter(value.socket,USERNAME,async (data: {
          success: boolean,
          status: number,
          message: string
        }) => {
          console.log('inside handler');
          
          const newInstance = await Instance.create({
            backendId: key,
            userId: userData._id
          })
          if (timeout) return;
          clearTimeout(timeoutId)
          return res.status(data.status || 500).json(
            new ApiResponse(data.success, data.message || "Something went wrong")
          )
        })

        console.log('awaited response from backend : ',value.backendInfo.username);
        

      }
    }

    return res.status(400).json(
      new ApiResponse(false, "You already have existing instance in all active backends")
    )
  } catch (error) {
    console.log('ERROR : ',error);
    
    return res.status(500).json(
      new ApiResponse(false, error?.message || "Something went wrong")
    )
  }
}

/**         Delete existing instance
 * 1. authMiddleware -> route handler
 * 2. retrive backendId from the req.body
 * 3. check if that backend is currently active or not if not reject
 * 4. ask that backend whether there is already one instance with USERNAME = userData.username if no reject
 * 5. if yes tell that backend to delete that instance
 */

export async function deleteExistingInstanceController(req:Request,res:Response){
  const userData=req.data;
  console.log('userData : ',userData);

  try {
    const {backendId} = req.body;
    if(!activeBackends.has(backendId)){
      return res.status(500).json(
        new ApiResponse(false,"Requested backend is not connected at the moment try again later")
      )
    }

    const {socket} = activeBackends.get(backendId)
    const USERNAME=userData.username

    socket.emit('check_if_container_exists',{
      USERNAME
    })

    let timeout=false;
    const timeoutId=setTimeout(()=>{
      timeout=true
      return res.status(500).json(
        new ApiResponse(false,"Timeout deleting the container, wait for few minutes")
      )
    },MAX_CLIENT_WAITING_TIME)

    await asyncSocketAwaiter(socket,USERNAME,async(exists:boolean)=>{
      if(timeout){
        return;
      } else {
        clearTimeout(timeoutId)
      }
      if(!exists){
        return res.status(400).json(
          new ApiResponse(false,"You dont have instance on this backend")
        )
      }
      socket.emit('delete_container',{USERNAME});
      await asyncSocketAwaiter(socket,USERNAME,async(data:{
        success:boolean,
        status:number,
        message:string
      })=>{
        console.log('response from backend for deleting container is : ',data);
        
        const {success,status,message} = data;

        if(success){
          //deleting the instance data from db
          const deletedInstance=await Instance.deleteOne({
            backendId,
            userId:userData._id
          })

          if(!deletedInstance.deletedCount){
            return res.status(500).json(
              new ApiResponse(false,"Deleted the instance from backend but failed to update database")
            )
          }

          return res.status(status).json(
            new ApiResponse(true,message)
          )
        } 
        return res.status(status).json(
          new ApiResponse(false,message)
        )
      })
    })

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,error?.message??"Something went wrong : Delete Instance")
    )
  }
}

/**         Resume existing instance
 * 1. authMiddleware -> route handler
 * 2. retrive backendId from req.body
 * 3. check if that backend is connected right not if not reject
 * 4. ask that backend if i have instance of this user if not reject
 * 5. ask that backend if the instance(container) is running right now or not if yes then reject => already running
 * 6. tell that backend to resume this instance
 */
export async function resumeExistingInstanceController(req:Request,res:Response){
 const userData=req.data;
  console.log('userData : ',userData);

  try {
    const {backendId} = req.body;
    if(!activeBackends.has(backendId)){
      return res.status(500).json(
        new ApiResponse(false,"Requested backend is not connected at the moment try again later")
      )
    }

    const {socket} = activeBackends.get(backendId)
    const USERNAME=userData.username

    socket.emit('check_if_container_exists',{
      USERNAME
    })

    let timeout=false;
    const timeoutId=setTimeout(()=>{
      timeout=true
      return res.status(500).json(
        new ApiResponse(false,"Timeout checking status of the container, wait for few minutes")
      )
    },MAX_CLIENT_WAITING_TIME)
    
    await asyncSocketAwaiter(socket,USERNAME,async(exists:boolean)=>{

      if(timeout){
        return;
      } else {
        clearTimeout(timeoutId)
      }
      if(!exists){
        return res.status(400).json(
          new ApiResponse(false,"You dont have instance on this backend")
        )
      }

      socket.emit('check_if_container_running',{USERNAME});

      await asyncSocketAwaiter(socket,USERNAME,async(running:boolean)=>{
        if(timeout){
          return;
        } else {
          clearTimeout(timeoutId)
        }
        if(running){
          return res.status(200).json(
            new ApiResponse(false,"Instance is already running")
          )
        }
        socket.emit("resume_container",{USERNAME})

        await asyncSocketAwaiter(socket,USERNAME,async(data:{
          success:boolean,
          status:number,
          message:string
        })=>{
          if(timeout){
            return;
          } else {
            clearTimeout(timeoutId)
          }
          const {success,status,message} = data;
          if(success){
            //updating DB running:true for instance collection
            const instance=await Instance.findOne({
              backendId,
              userId:userData._id
            })

            //TODO: add extra checking at the time of defining validation using zod
            if(instance){
              instance.running=true
              await instance.save()
            }
            return res.status(status).json(
              new ApiResponse(true,"Instance resumed successfuly")
            )
          }
        })
      })
    })

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,error?.message??"Something went wrong : Delete Instance")
    )
  }
}

/**         Stop existing instance
 * 1.authMiddleware -> route handler
 * 2.retrive backendId from req.body
 * 3.check if that backend is running if not reject
 * 4.ask that backend if you have instance of this user if not reject
 * 5. ask that backend if you have this instance(container) running of this user 
 * 6.if yes then tell that backend to kill that container
 */
export async function stopExistingInstanceController(req:Request,res:Response){
const userData=req.data;
  console.log('userData : ',userData);

  try {
    const {backendId} = req.body;
    if(!activeBackends.has(backendId)){
      return res.status(500).json(
        new ApiResponse(false,"Requested backend is not connected at the moment try again later")
      )
    }

    const {socket} = activeBackends.get(backendId)
    const USERNAME=userData.username

    socket.emit('check_if_container_exists',{
      USERNAME
    })

    let timeout=false;
    const timeoutId=setTimeout(()=>{
      timeout=true
      return res.status(500).json(
        new ApiResponse(false,"Timeout checking status of the container, wait for few minutes")
      )
    },MAX_CLIENT_WAITING_TIME)

    
    await asyncSocketAwaiter(socket,USERNAME,async(exists:boolean)=>{

      if(timeout){
        return;
      } else {
        clearTimeout(timeoutId)
      }

      if(!exists){
        return res.status(400).json(
          new ApiResponse(false,"You dont have instance on this backend")
        )
      }

      socket.emit('check_if_container_running',{USERNAME});

      await asyncSocketAwaiter(socket,USERNAME,async(running:boolean)=>{
        if(timeout){
          return;
        } else {
          clearTimeout(timeoutId)
        }
        if(!running){
          return res.status(200).json(
            new ApiResponse(false,"Instance is already stopped")
          )
        }
        socket.emit("stop_container",{USERNAME})

        await asyncSocketAwaiter(socket,USERNAME,async(data:{
          success:boolean,
          status:number,
          message:string
        })=>{
          if(timeout){
            return;
          } else {
            clearTimeout(timeoutId)
          }
          const {success,status,message} = data;
          if(success){
            //updating DB running:false for instance collection
            const instance=await Instance.findOne({
              backendId,
              userId:userData._id
            })

            //TODO: add extra checking at the time of defining validation using zod
            if(instance){
              instance.running=false
              await instance.save()
            }
            return res.status(status).json(
              new ApiResponse(true,message)
            )
          }
        })
      })
    })

  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,error?.message??"Something went wrong : Delete Instance")
    )
  }
}

/** Get all instances of user
 * 1.authMiddleware -> route handler
 * 2.aggregation pipeline i.match userId=userData._id ii.lookup for for backendId
 * 3.return [0] of it
 */

export async function getAllInstancesOfUserController(req:Request,res:Response){
  try {
    const userData=req.data;
    const allUserInstances = await Instance.aggregate([{
      $match:{
        userId:new mongoose.Types.ObjectId(userData._id)
      }
    },{
      $lookup:{
        from:"backends",
        localField:"backendId",
        foreignField:"_id",
        as:"backend"
      }
    },{
      $unwind:"$backend"
    }])
    return res.status(200).json(
      new ApiResponse(true,"All instances fetched successfully",allUserInstances)
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false,"Failed to fetch all instances")
    )
  }
}