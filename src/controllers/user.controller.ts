import { type NextFunction, type Request, type Response } from "express";
import { send } from "process";
import appService from "../services/user-service";
import { email, uuid } from "zod";

class UserController {
    /**
     * Get the user/application info based on the authenticated user.
     * The username, userId, playerId are passed from the AuthMiddleware.
     */
    static getUserData = async (req: Request, res: Response, next: NextFunction) => {        
        try {
            if (req.user) {
                const user = await appService.getData(req.user?.userId)
                return res.send({
                    user: { // IUser in frontend
                        user_id: user?.id,
                        uuid: user?.uuid,
                        username: user?.username,
                        fullname: user?.full_name,
                        email: user?.email,
                        regdate: user?.createdAt,
                        image: user?.image,
                        role: user?.role
                    }, 
                    player: { // IPlayer in frontend
                        player_id: user?.player?.id,
                        balance: user?.player?.balance,
                        total_income: user?.player?.total_income,
                        inventory_size: user?.player?.inventory_size,
                        inventory_extention_price: user?.player?.inv_ext_price,
                    }})
            }
        } catch (e) {
            next(e)
        }
    };
}

export default UserController; 