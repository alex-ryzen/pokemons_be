import BaseRouter, { type RouteConfig } from "./router";
import AuthMiddleware from "../middlewares/auth.middleware";
import AppMiddleware from "../middlewares/user.middleware";

class InventoryRoutes extends BaseRouter {
    constructor() {
        super([AuthMiddleware.authenticate, AppMiddleware.actualizeBalance])
    }
    protected routes(): RouteConfig[] {
        return [
            {
                method: "get",
                path: "/items",
                middlewares: [
                ],
                handler: ()=>{}
            },
        ]
    }
}

export default new InventoryRoutes().router;