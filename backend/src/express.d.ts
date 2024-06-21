import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace `any` with your user type, e.g., `User`
    }
  }
}
