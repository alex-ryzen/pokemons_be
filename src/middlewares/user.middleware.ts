import type { Request, Response, NextFunction } from "express";
import appService from "../services/user-service";

class UserMiddleware {
    static async actualizeBalance(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.user && req.user.playerId) {
                await appService.getActualBalance(req.user.playerId)
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default UserMiddleware;