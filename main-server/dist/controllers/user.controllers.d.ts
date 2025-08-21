import type { Request, Response } from "express";
export declare function userSignupController(req: Request, res: Response): Promise<any>;
export declare function userSigninController(req: Request, res: Response): Promise<any>;
/**         Create an instance
 * 1.authMIddleware req.data from decoding jwt -> route handler
 * 2.check no of instances of user if it exceeds the allowed limit then reject
 * 3.check no of active pc's
 * 4.ask one by one each active backend do you have already have a docker container with that USERNAME
 * 5.if found any without having any docker container for that USERNAME tell that backend to "start_container"
 * 6.if all already have runnign container reject insufficient no of backends availaible to start new instance
 */
export declare function createNewInstanceController(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**         Delete existing instance
 * 1. authMiddleware -> route handler
 * 2. retrive backendId from the req.body
 * 3. check if that backend is currently active or not if not reject
 * 4. ask that backend whether there is already one instance with USERNAME = userData.username if no reject
 * 5. if yes tell that backend to delete that instance
 */
export declare function deleteExistingInstanceController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**         Resume existing instance
 * 1. authMiddleware -> route handler
 * 2. retrive backendId from req.body
 * 3. check if that backend is connected right not if not reject
 * 4. ask that backend if i have instance of this user if not reject
 * 5. ask that backend if the instance(container) is running right now or not if yes then reject => already running
 * 6. tell that backend to resume this instance
 */
export declare function resumeExistingInstanceController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
/**         Stop existing instance
 * 1.authMiddleware -> route handler
 * 2.retrive backendId from req.body
 * 3.check if that backend is running if not reject
 * 4.ask that backend if you have instance of this user if not reject
 * 5. ask that backend if you have this instance(container) running of this user
 * 6.if yes then tell that backend to kill that container
 */
export declare function stopExistingInstanceController(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=user.controllers.d.ts.map