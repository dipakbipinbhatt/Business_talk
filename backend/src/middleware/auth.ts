import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User } from '../models/User';
import { isDBConnected } from '../config/db';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Access token required' });
            return;
        }

        const decoded = jwt.verify(token, config.jwt.secret) as {
            id: string;
            email: string;
            role: string;
        };

        // In demo mode (MongoDB not connected), skip user lookup for mock admin
        if (!isDBConnected() && decoded.id === 'mock-admin-id') {
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
            next();
            return;
        }

        // Normal mode: verify user exists in database
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: 'Token expired' });
            return;
        }
        res.status(403).json({ message: 'Invalid token' });
    }
};

export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Admin access required' });
        return;
    }
    next();
};
