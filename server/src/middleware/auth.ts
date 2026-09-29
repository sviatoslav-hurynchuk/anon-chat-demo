import type { Request, Response, NextFunction } from 'express';
import { auth } from '../firebase-admin';

/** Extend Express Request to include authenticated user's UID */
declare global {
  namespace Express {
    interface Request {
      uid?: string;
    }
  }
}

/**
 * Express middleware that verifies Firebase ID Token from the
 * Authorization: Bearer <token> header.
 *
 * On success, attaches `req.uid` with the anonymous user's UID.
 * On failure, returns 401 Unauthorized.
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = header.slice(7); // Remove "Bearer " prefix

  try {
    const decoded = await auth.verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
