import { Request as ExpressRequest } from 'express';

export interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: number;
    email: string;
    credits: number;
    createdAt: string;
  };
}
