import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import { ZodError } from "zod";


interface ErrorHandlerArgs {
    err: ApiError | ZodError | Error,
    req: Request,
    res: Response,
    next: NextFunction
}

export const errorMiddleware = (
    err: Error | ApiError | ZodError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('[ErrorMiddleware]:', err);

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
        });
    }

    if (err instanceof ZodError) {
        return res.status(422).json({
            message: '<!> VALIDATION ERROR <!>',
            errors: err.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }))
        });
    }

    // const errorConfig = errorMap[err.name];
    // if (errorConfig) {
    //     return res.status(errorConfig.status).json({
    //         message: errorConfig.message,
    //         errors: err
    //     });
    // }

    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ message: 'Invalid JSON' });
    }

    return res.status(500).json(err);
};