import { Op, where } from "sequelize";
import { User } from "../models/User";
import { Player } from "../models/Player";
import { ApiError } from "../errors/ApiError";
import bcrypt from "bcrypt";
import {type LoginDataType} from "../controllers/auth.controller"
import authConfig from "../config/auth.config";
import jwt from "jsonwebtoken";
import type { DTO } from "../middlewares/auth.middleware";
import { Token } from "../models/Token";

class AuthService {
    async login(data: LoginDataType) {
        const { body: { login, password } } = data
        const user = await User.findOne({
            where: {
                [Op.or]: [{email: login.identifier}, {username: login.identifier}]
            },
            include: Player,
        })
        if (!user) {
            return new ApiError({status: 500, message: "Invalid credentials"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) {
            return new ApiError({status: 500, message: "Invalid credentials"})
        }
        const payload: DTO = { username: user.username!, userId: user.id, playerId: user.player?.id! }
        const {accessToken, refreshToken} = this.generateTokens(payload)
        await this.saveToken(user.id, refreshToken)
        return {
            accessToken, 
            refreshToken
        }
    }

    generateTokens(payload: DTO) {
        const accessToken = jwt.sign(
                payload,
                authConfig.access_secret!, 
                { expiresIn: authConfig.access_expires_in!}  // Use the expiration time from the config (e.g., "15m")
        );
        const refreshToken = jwt.sign(
            payload,
            authConfig.refresh_secret!, 
            { expiresIn: authConfig.refresh_expires_in!}  // Use the expiration time for the refresh token (e.g., "24h")
        );
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await Token.findOne({where: {user_id: userId}})
        if (tokenData) {
            tokenData.refresh_token = refreshToken;
            return await tokenData.save();
        }
        const token = await Token.create({user_id: userId, refresh_token: refreshToken})
        return token;
    }

    async removeToken(refreshToken: string) {
        const tokenData = await tokenModel.deleteOne({refreshToken})
        return tokenData;
    }

    async findToken(refreshToken: string) {
        const tokenData = await tokenModel.findOne({refreshToken})
        return tokenData;
    }
};

export default new AuthService();