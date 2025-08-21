import type { Request, Response } from "express";
import ApiError from "../helpers/ApiError.js";
import ApiResponse from "../helpers/ApiResponse.js";
import handleApiError from "../helpers/handleApiError.js";
import { generateUserAccessToken } from "../helpers/token.js";
import User from "../models/user.model.js";

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

    return res.status(200)
      .cookie("accessToken", accessToken)
      .json(new ApiResponse(true, "Login successfully"))

  } catch (error: unknown) {
    return handleApiError(res, error)
  }
}

export async function createNewInstanceController(req:Request,res:Response) {
  const userData = req.data;
  const { SSH_PUB_KEY } = req.body;

  try {

    const user = await User.aggregate([
      {
        $match: {
          _id: userData._id
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

    if (user.length == 0) {
      return res.status(404).json(
        new ApiResponse(false, "User not found")
      )
    } else if (maxNoOfInstancesPerUser) {
      const noOfInstancesOfUser = user[0].instances.length
      if (noOfInstancesOfUser > maxNoOfInstancesPerUser) {
        return res.status(400).json(
          new ApiResponse(false, "You have reached max no of instances limit, delete existing instances to spawn new")
        )
      }
    }
    const USERNAME = user[0].username

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
        value.socket.once(USERNAME, async (data: {
          success: boolean,
          status: number,
          message: string
        }) => {
          const newInstance = await Instance.create({
            backendId: key,
            userId: userData._id
          })
          if (timeout) return;
          return res.status(data.status || 500).json(
            new ApiResponse(data.success, data.message || "Something went wrong")
          )
        })

        setTimeout(() => {
          timeout = true;
          return res.status(500).json(
            new ApiResponse(false, "Response timeout, please wait while your request is being processed")
          )
        }, MAX_CLIENT_WAITING_TIME)
      }
    }

    return res.status(400).json(
      new ApiResponse(false, "You already have existing instance in all active backends")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false, error?.message || "Something went wrong")
    )
  }
}