import jwt from "jsonwebtoken";
import ApiResponse from "../helpers/ApiResponse.js";
export default function authMiddleware(req, res, next) {
    try {
        console.log('inside authMiddleware');
        const accessToken = req.cookies.accessToken;
        if (accessToken) {
            const userData = jwt.verify(accessToken, process.env.USER_ACCESS_TOKEN_SECRET);
            req.data = userData;
            next();
            return;
        }
        const accessTokenBE = req.cookies.accessTokenBE;
        if (!accessTokenBE) {
            return res.status(401).json(new ApiResponse(false, "Access Token not found"));
        }
        const backendInfo = jwt.verify(accessTokenBE, process.env.BACKEND_ACCESS_TOKEN_SECRET);
        req.data = backendInfo;
        next();
        return;
    }
    catch (error) {
        return res.status(401).json(new ApiResponse(false, "Invalid Access Token"));
    }
}
//# sourceMappingURL=authMiddleware.js.map