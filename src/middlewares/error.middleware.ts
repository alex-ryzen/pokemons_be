import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import { ZodError } from "zod";


type ErrorHandlerAliace = ( 
    err: ApiError | ZodError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => Response<any, Record<string, any>>

export const errorMiddleware: ErrorHandlerAliace = (err, req, res, next) => {
    console.error('[ErrorMiddleware]:', err, "message: ", err.message);

    if (err instanceof ApiError) {
        return res.status(err.status!).json({
            message: err.message,
            errors: err.errors
        });
    }

    if (err instanceof ZodError) {
        return res.status(422).json({
            message: '<!> VALIDATION ERROR <!>',
            errors: err.issues.map(e => ({
                path: e.path.join('.'),
                message: e.message,
                code: e.code
            }))
        });
    }

    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    return res.status(500).json(err);
};