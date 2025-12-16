

import { type Request, type Response } from "express";
import { send } from "process";

class UserController {
    /**
     * Get the user information based on the authenticated user.
     * The userId is passed from the AuthMiddleware.
     */
    static getUser = async (req: Request, res: Response) => {        
        try {
            
        } catch (error) {
            
        }
    };
}

export default UserController;