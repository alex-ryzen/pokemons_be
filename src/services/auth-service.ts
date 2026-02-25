import { Op, where } from "sequelize";
import { User } from "../models/User";
import { Player } from "../models/Player";
import { ApiError } from "../errors/ApiError";
import bcrypt from "bcrypt";
import { type LoginDataType, type RegisterDataType } from "../controllers/auth.controller"
import authConfig from "../config/auth.config";
import jwt from "jsonwebtoken";
import type { DTO } from "../middlewares/auth.middleware";
import { Token } from "../models/Token";
import { v4 } from "uuid"
import { Garden } from "../models/Garden";


class AuthService {
    async login(data: LoginDataType) {
        const { body: { login, password } } = data
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: login}, { username: login }]
            },
            include: {model: Player, as: 'player'},
        })
        if (!user) {
            throw new ApiError(401, "Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) {
            throw new ApiError(401, "Wrong password")
        }
        const payload: DTO = { username: user.username!, userId: user.id, playerId: user.player?.id! }
        const { accessToken, refreshToken, refresh_expires_in } = this.generateTokens(payload)
        await this.saveToken(user.id, refreshToken)
        return {
            username: payload.username,
            accessToken,
            refreshToken,
            refresh_expires_in
        }
    }

    async logout(refreshToken: string) {
        const userData = this.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ApiError.Unauthorized();
        }
        const tokenIsDeleted = await this.removeToken(userData.userId);
        return tokenIsDeleted;
    }

    async registration(data: RegisterDataType) {
        const { body: { username, email, password } } = data
        const duplicate = await User.findOne({ 
            where: {
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            }
        })
        if (duplicate) {
            throw ApiError.BadRequest(`Пользователь с таким логином или почтовым адресом уже существует!`)
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ uuid: v4(), username, email, password: hashPassword })

        const player = await Player.create({user_id: user.id, balance: "10000.00", total_income: "0.00", individual_factor: "1.00", inventory_size: 15, inv_ext_price: "1000.00"})
        const garden = await Garden.create({player_id: player.id, garden_size: 25, growth_speed: "0.15"})
        
        const payload: DTO = { username: user.username!, userId: user.id, playerId: user.player?.id! }
        const { accessToken, refreshToken, refresh_expires_in } = this.generateTokens(payload)
        await this.saveToken(user.id, refreshToken)
        return {
            username: payload.username,
            accessToken,
            refreshToken,
            refresh_expires_in
        }
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.Unauthorized();
        }
        const userData = this.validateRefreshToken(refreshToken);
        if (!userData) {
            const decoded_id = (jwt.decode(refreshToken) as DTO).userId
            const tokenIsDeleted = await this.removeToken(decoded_id);
            throw ApiError.Unauthorized(`Refresh token has been expired and has been deleted (${tokenIsDeleted})`);
        }
        const user = await User.findByPk(userData.userId);
        if (!user) {
            throw ApiError.Unauthorized("Token payload error :(");
        }
        const payload: DTO = { username: user.username!, userId: user.id, playerId: user.player?.id! }
        const accessToken = this.generateAccessToken(payload)
        //await this.saveToken(user.id, refreshToken)
        return {
            accessToken
        }
    }

    generateAccessToken(payload: DTO): string {
        return jwt.sign(
            payload,
            authConfig.access_secret!,
            { expiresIn: authConfig.access_expires_in!, algorithm: 'HS256' }
        );
    }

    generateRefreshToken(payload: DTO): string {
        return jwt.sign(
            payload,
            authConfig.refresh_secret!,
            { expiresIn: authConfig.refresh_expires_in!, algorithm: 'HS256' }
        );
    }

    generateTokens(payload: DTO) {
        const accessToken = this.generateAccessToken(payload)
        const refreshToken = this.generateRefreshToken(payload)
        const refresh_expires_in = this.getExpiresAtFromToken(refreshToken)
        return {
            accessToken,
            refreshToken,
            refresh_expires_in
        }
    }

    validateAccessToken(token: string): DTO | null {
        try {
            const userData = jwt.verify(token, authConfig.access_secret!) as DTO;
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token: string): DTO | null {
        try {
            const userData = jwt.verify(token, authConfig.refresh_secret!) as DTO;
            return userData;
        } catch (e) {
            return null;
        }
    }

    getExpiresAtFromToken(token: string): Date {
        const decoded = jwt.decode(token) as { exp: number };
        return new Date(decoded.exp * 1000);
    }

    async saveToken(userId: number, refreshToken: string) {
        const expiresIn = this.getExpiresAtFromToken(refreshToken);
        const tokenData = await Token.findOne({ where: { user_id: userId } })
        if (tokenData) {
            tokenData.refresh_token = refreshToken;
            tokenData.expires_in = expiresIn
            return await tokenData.save();
        }
        const token = await Token.create({ user_id: userId, refresh_token: refreshToken, expires_in: expiresIn })
        return token;
    }

    async removeToken(userId: number) {
        const tokenIsDeleted = await Token.destroy({ where: { user_id: userId } })
        return tokenIsDeleted;
    }

    async findToken(userId: number) {
        const tokenData = await Token.findOne({ where: { user_id: userId } })
        return tokenData;
    }
};

export default new AuthService();