import {StatusCodes as sc} from "http-status-codes"

interface ApiErrorArgs {
    status: number;
    message?: string;
    errors?: Record<string, string[]>;
}

export class ApiError extends Error {
    status: ApiErrorArgs["status"];
    errors: ApiErrorArgs["errors"];

    constructor({status, message, errors}: ApiErrorArgs) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static BadRequest({message = "BadRequest", errors = {}}: ApiErrorArgs) {
        return new ApiError({status: sc.BAD_REQUEST, message, errors});
    }

    static Unauthorized({message = 'Unauthorized'}) {
        return new ApiError({status: sc.UNAUTHORIZED, message});
    }

    static Forbidden({message = 'Forbidden'}) {
        return new ApiError({status: sc.FORBIDDEN, message});
    }

    static NotFound({message = 'Not found'}) {
        return new ApiError({status: sc.NOT_FOUND, message});
    }

    static Conflict({message = 'Data Conflict'}) {
        return new ApiError({status: sc.CONFLICT, message});
    }

    static Internal({message = 'Internal Server Error'}) {
        return new ApiError({status: sc.INTERNAL_SERVER_ERROR, message});
    }
}
