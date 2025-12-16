import BaseRouter, { type RouteConfig } from "./router";
import AuthMiddleware from "../middlewares/auth.middleware";
import ShopController from "../controllers/shop.controller";

class ShopRoutes extends BaseRouter {
    constructor() {
        super([])//AuthMiddleware.authenticate
    }
    protected routes(): RouteConfig[] {
        return [
            {
                method: "get",
                path: "/items",
                middlewares: [
                ],
                handler: ShopController.getShopItems
            },
        ]
    }
}

export default new ShopRoutes().router;