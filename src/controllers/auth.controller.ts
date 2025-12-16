import { type NextFunction, type Request, type Response } from "express";
import authSchema from "../validations/auth.schema";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth.config";
import AuthService from "../services/auth-service";

export type LoginDataType = z.infer<typeof authSchema.login>
export type RegisterDataType = z.infer<typeof authSchema.register>

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: LoginDataType = {body: req.body};
            const {username, accessToken, refreshToken} = await AuthService.login(data)
            
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,  // 24 hours is mileseconds
                sameSite: "strict"
            });
            return res.send({message: `Hello again, ${username}`, token: accessToken})
        } catch (e) {
            next(e)
        }
    }
    
    static registration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: RegisterDataType = {body: req.body};
            const {username, accessToken, refreshToken} = await AuthService.registration(data)
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000,  // 24 hours is mileseconds
                sameSite: "strict"
            });
            return res.send({message: `Welcome, ${username}`, token: accessToken})
        } catch (e) {
            next(e);
        }
    }

    static logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies.refresh_token;
            const token = await AuthService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.send("bye-bye ;3");
        } catch (e) {
            next(e);
        }
    }

    static refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {refreshToken} = req.cookies.refresh_token;
            const {accessToken} = await AuthService.refresh(refreshToken);
            return res.json(accessToken);
        } catch (e) {
            next(e);
        }
    }

}

export default AuthController;

// res.cookie("accessToken", accessToken, {
//         httpOnly: true,   // Ensure the cookie cannot be accessed via JavaScript (security against XSS attacks)
//         secure: process.env.NODE_ENV === "production",  // Set to true in production for HTTPS-only cookies
//         maxAge: 15 * 60 * 1000,  // 15 minutes in mileseconds
//         sameSite: "strict"  // Ensures the cookie is sent only with requests from the same site
// });