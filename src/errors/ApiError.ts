import {StatusCodes as sc} from "http-status-codes"


interface ApiErrorArgsType {
    status?: number;
    message?: string;
    errors?: Record<string, string[]>;
}

export class ApiError extends Error {
    
    public status: ApiErrorArgsType["status"];
    public errors: ApiErrorArgsType["errors"];

    constructor(
        status?: ApiErrorArgsType["status"], 
        message?: ApiErrorArgsType["message"], 
        errors?: ApiErrorArgsType["errors"]
    ) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static BadRequest(message = "BadRequest", errors = {}) {
        return new ApiError(sc.BAD_REQUEST, message, errors);
    }

    static Unauthorized(message = 'Unauthorized', errors = {}) {
        return new ApiError(sc.UNAUTHORIZED, message, errors);
    }

    static Forbidden(message = 'Forbidden', errors = {}) {
        return new ApiError(sc.FORBIDDEN, message, errors);
    }

    static NotFound(message = 'Not found', errors = {}) {
        return new ApiError(sc.NOT_FOUND, message, errors);
    }

    static Conflict(message = 'Data Conflict', errors = {}) {
        return new ApiError(sc.CONFLICT, message, errors);
    }

    static Internal(message = 'Internal Server Error', errors = {}) {
        return new ApiError(sc.INTERNAL_SERVER_ERROR, message, errors);
    }
}
