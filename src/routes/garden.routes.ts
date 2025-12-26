import BaseRouter, { type RouteConfig } from "./router";
import AuthMiddleware from "../middlewares/auth.middleware";
import AppMiddleware from "../middlewares/user.middleware";

class GardenRoutes extends BaseRouter {
    constructor() {
        super([AuthMiddleware.authenticate, AppMiddleware.actualizeBalance])
    }
    protected routes(): RouteConfig[] {
        return [
            {
                method: "get",
                path: "/berries",
                middlewares: [
                ],
                handler: ()=>{}
            },
        ]
    }
}

export default new GardenRoutes().router;