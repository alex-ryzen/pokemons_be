import BaseRouter, { type RouteConfig } from "./router";
import AuthMiddleware from "../middlewares/auth.middleware";
import ShopController from "../controllers/shop.controller";
import AppController from "../controllers/user.controller";
import AppMiddleware from "../middlewares/user.middleware";

class UserRoutes extends BaseRouter {
    constructor() {
        super([AuthMiddleware.authenticate, AppMiddleware.actualizeBalance])
    }
    protected routes(): RouteConfig[] {
        return [
            {
                method: "get",
                path: "/data", // api/user/data
                middlewares: [
                    AuthMiddleware.authenticate
                ],
                handler: AppController.getUserData
            },
            
        ]
    }
}

export default new UserRoutes().router;