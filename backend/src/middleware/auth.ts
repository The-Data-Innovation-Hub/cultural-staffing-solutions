import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware to require authentication via JWT
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies.accessToken || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    // Verify and decode token
    try {
      const decoded = verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Invalid or expired token',
        code: 'UNAUTHORIZED'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      message: 'Authentication error',
      code: 'INTERNAL_ERROR'
    });
  }
}

/**
 * Middleware to require specific role
 */
export function requireRole(role: 'employee' | 'manager' | 'admin') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      });
    }

    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Manager can access manager and employee routes
    if (role === 'manager' && (req.user.role === 'manager' || req.user.role === 'admin')) {
      return next();
    }

    // Check exact role match
    if (req.user.role === role) {
      return next();
    }

    return res.status(403).json({
      message: 'Insufficient permissions',
      code: 'FORBIDDEN'
    });
  };
}
