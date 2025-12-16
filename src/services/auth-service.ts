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


class AuthService {
    async login(data: LoginDataType) {
        const { body: { login, password } } = data
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: login}, { username: login }]
            },
            include: Player,
        })
        if (!user) {
            throw new ApiError(401, "Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) {
            throw new ApiError(401, "Wrong password")
        }
        const payload: DTO = { username: user.username!, userId: user.id, playerId: user.player?.id! }
        const { accessToken, refreshToken } = this.generateTokens(payload)
        await this.saveToken(user.id, refreshToken)
        return {
            username: payload.username,
            accessToken,
            refreshToken
        }
    }

    async logout(refreshToken: string) {
        const userData = this.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ApiError.Unauthorized();
        }
        const token = await this.removeToken(userData.userId);
        return token;
    }

    async registration(data: RegisterDataType) {
        const { body: { username, email, password } } = data
        const duplicate = await User.findOne({ where: { email } })
        if (duplicate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }

        const hashPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ uuid: v4(), username, email, password: hashPassword })
        //todo
        const player = await Player.create({user_id: user.id, balance: "0.00", total_income: "0.00", })
        
        const payload: DTO = { username: user.username!, userId: user.id, playerId: user.player?.id! }
        const { accessToken, refreshToken } = this.generateTokens(payload)
        await this.saveToken(user.id, refreshToken)
        return {
            username: payload.username,
            accessToken,
            refreshToken
        }
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.Unauthorized();
        }
        const userData = this.validateRefreshToken(refreshToken);
        const tokenFromDb = await this.findToken(userData?.userId!);
        if (!userData || !tokenFromDb) {
            throw ApiError.Unauthorized();
        }
        const user = await User.findByPk(userData.userId);
        if (!user) {
            throw ApiError.BadRequest("Token payload error :(");
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
        return {
            accessToken,
            refreshToken
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

    async saveToken(userId: number, refreshToken: string) {
        const tokenData = await Token.findOne({ where: { user_id: userId } })
        if (tokenData) {
            tokenData.refresh_token = refreshToken;
            return await tokenData.save();
        }
        const token = await Token.create({ user_id: userId, refresh_token: refreshToken })
        return token;
    }

    async removeToken(userId: number) {
        const tokenData = await Token.destroy({ where: { user_id: userId } })
        return tokenData;
    }

    async findToken(userId: number) {
        const tokenData = await Token.findOne({ where: { user_id: userId } })
        return tokenData;
    }
};

export default new AuthService();