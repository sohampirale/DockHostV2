import { Router } from "express";
import ApiResponse from "../helpers/ApiResponse.js";
import ApiError from "../helpers/ApiError.js";
import { generateBackendAccessToken } from "../helpers/token.js";
import { signinBackendController, signupBackendController } from "../controllers/backend.controllers.js";
const backendRouter = Router();
backendRouter.route("/signup")
    .post(signupBackendController);
backendRouter.route("/signin")
    .post(signinBackendController);
export default backendRouter;
//# sourceMappingURL=backend.routes.js.map