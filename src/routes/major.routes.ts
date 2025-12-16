import BaseRouter, { type RouteConfig } from "./router";
import AuthMiddleware from "../middlewares/auth.middleware";
import ShopController from "../controllers/shop.controller";

class MajorRoutes extends BaseRouter {
    constructor() {
        super([AuthMiddleware.authenticate])
    }
    protected routes(): RouteConfig[] {
        return [
            // {
            //     method: "get",
            //     path: "/info", // api/user/info
            //     middlewares: [
            //     ],
            //     handler: 
            // },
        ]
    }
}

export default new MajorRoutes().router;