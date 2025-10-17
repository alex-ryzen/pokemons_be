import * as express from 'express'; // Import express for type definitions
import type { DTO } from '../../middlewares/auth.middleware';

declare global {
    namespace Express {
        interface Request {
            user?: DTO;
        }
    }
}