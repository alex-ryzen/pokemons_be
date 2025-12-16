import AuthController from "../controllers/auth.controller";
import BaseRouter, { type RouteConfig } from "./router";
import { validate } from "../middlewares/validation.middleware";
import authSchema from "../validations/auth.schema";
import AuthMiddleware from "../middlewares/auth.middleware";
import { RouteMethods } from "./router";

class AuthRouter extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                // login
                method: RouteMethods.post,
                path: "/login",
                middlewares: [
                    validate(authSchema.login)
                ],
                handler: AuthController.login
            },
            {
                // register
                method: RouteMethods.post,
                path: "/register",
                middlewares: [
                    validate(authSchema.register)
                ],
                handler: AuthController.registration
            },
            {
                // logout
                method: RouteMethods.post,
                path: "/logout",
                middlewares: [
                    AuthMiddleware.authenticate // check if user is logged in
                ],
                handler: AuthController.logout
            },

            {
                // refresh token
                method: RouteMethods.post,
                path: "/refresh-token",
                middlewares: [],
                handler: AuthController.refresh
            },
        ]
    }
}

export default new AuthRouter().router;