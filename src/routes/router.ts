import { Router, type RequestHandler, type IRouterMatcher } from "express";
//import { METHODS } from "http";

// Define the possible HTTP methods for routes
// export type RouteMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head";
export const RouteMethods = {
    get: "get",
    post: "post",
    put: "put",
    delete: "delete",
    patch: "patch",
    options: "options",
    head: "head"
} as const;
export type RouteMethod = (typeof RouteMethods)[keyof typeof RouteMethods];
//type RouteMethod = Lowercase<typeof METHODS[number]>

// Interface to describe the configuration of each route
export interface RouteConfig {
    method: RouteMethod;       // HTTP method (get, post, etc.)
    path: string;              // Path for the route
    handler: RequestHandler;   // Request handler for the route (controller method)
    middlewares?: RequestHandler[];  // Optional middlewares for this route
}

// Abstract base class for creating routes
export default abstract class BaseRouter {
    public router: Router;

    // Constructor that initializes the router
    constructor(generalMiddlewares?: RequestHandler[]) {
        this.router = Router();  // Create a new Express Router instance
        generalMiddlewares?.map((gm) => {
            this.router.use(gm)
        })
        this.registerRoutes();   // Register routes when the instance is created
    }

    // Abstract method that must be implemented by subclasses to define the routes
    protected abstract routes(): RouteConfig[];

    // Private method that registers all the routes defined in the `routes` method
    private registerRoutes(): void {
        this.routes().forEach(({ method, path, handler, middlewares = [] }) => {
            this.router[method](path, ...middlewares, handler); // Use the appropriate HTTP method to register the route, applying any middlewares before the handler
        });
    }
}