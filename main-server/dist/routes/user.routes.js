import { Router } from "express";
import User from "../models/user.model.js";
import ApiResponse from "../helpers/ApiResponse.js";
import ApiError from "../helpers/ApiError.js";
import { generateUserAccessToken } from "../helpers/token.js";
import handleApiError from "../helpers/handleApiError.js";
import { createNewInstanceController, deleteExistingInstanceController, getAllInstancesOfUserController, resumeExistingInstanceController, stopExistingInstanceController, userSigninController, userSignupController } from "../controllers/user.controllers.js";
import { MAX_CLIENT_WAITING_TIME, maxNoOfInstancesPerUser } from "../constants/index.js";
import { activeBackends } from "../index.js";
import Instance from "../models/instance.model.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const userRouter = Router();
userRouter.route("/signup")
    .post(userSignupController);
userRouter.route("/signin")
    .post(userSigninController);
userRouter.route("/instance")
    .post(authMiddleware, createNewInstanceController)
    .delete(authMiddleware, deleteExistingInstanceController);
userRouter.route('/instance/resume')
    .put(authMiddleware, resumeExistingInstanceController);
userRouter.route('/instance/stop')
    .put(authMiddleware, stopExistingInstanceController);
userRouter.route("/instance")
    .get(authMiddleware, getAllInstancesOfUserController);
export default userRouter;
//# sourceMappingURL=user.routes.js.map