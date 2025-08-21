import { Router } from "express";
import User from "../models/user.model.js";
import ApiResponse from "../helpers/ApiResponse.js";
import ApiError from "../helpers/ApiError.js";
import { generateUserAccessToken } from "../helpers/token.js";
import handleApiError from "../helpers/handleApiError.js";
import { createNewInstanceController, userSigninController, userSignupController } from "../controllers/user.controllers.js";
import { MAX_CLIENT_WAITING_TIME, maxNoOfInstancesPerUser } from "../constants/index.js";
import { activeBackends } from "../index.js";
import Instance from "../models/instance.model.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const userRouter = Router();

userRouter.route("/signup")
  .post(userSignupController)

userRouter.route("/signin")
  .post(userSigninController)

/**Create an instance
 * 1.authMIddleware req.data from decoding jwt -> route handler
 * 2.check no of instances of user if it exceeds the allowed limit then reject
 * 3.check no of active pc's
 * 4.ask one by one each active backend do you have already have a docker container with that USERNAME
 * 5.if found any without having any docker container for that USERNAME tell that backend to "start_container"
 * 6.if all already have runnign container reject insufficient no of backends availaible to start new instance
 */

userRouter.route("/instance")
  .post(authMiddleware,createNewInstanceController)

async function checkIfInstanceExists(socket:any,USERNAME:string){
  return new Promise((resolve) => {
    socket.on("check_if_container_exists",{USERNAME})
    socket.once(USERNAME, (exists:boolean) => {
      resolve(exists);
    });
  }); 
}

export default userRouter;