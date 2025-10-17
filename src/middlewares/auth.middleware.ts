import authConfig from "../config/auth.config";
import { ApiError } from "../errors/ApiError";
import authService from "../services/auth-service";
import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

export interface DTO { // DecodedToken
    username: string,
    userId: number,
    playerId: number,
}

class AuthMiddleware {
    /**
     * Middleware to authenticate the user based on the access token stored in the HttpOnly cookie.
     * This middleware will verify the access token and attach the user information to the request object.
     */
    static authenticate = (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extract the access token from the HttpOnly cookie or "Authorization" header as "Bearer <token>"
            const token: string = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
            if (!token || (req.headers.authorization?.split(' ')[0] != "Bearer")) {
                throw ApiError.Unauthorized();
            }
            else {
                const userData = authService.validateAccessToken(token)
                if (!userData) {
                    throw ApiError.Unauthorized();
                }
                req.user = userData
                next()
            }
            next();
        } catch (error) {
            throw ApiError.Unauthorized();
        }
    };
}

export default AuthMiddleware;