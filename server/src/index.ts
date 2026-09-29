import express, { Request, Response } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { onRequest } from 'firebase-functions/v2/https';
import messagesRouter from './routes/messages';
import { authMiddleware } from './middleware/auth';

export const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10kb' }));

// Rate limiting for messages
// authMiddleware runs first so req.uid is populated for keyGenerator
const messageRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 messages per minute
  message: { error: 'Too many messages. Try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.uid || req.ip || 'unknown',
});

// Routes
app.use('/api/messages', authMiddleware, messageRateLimit, messagesRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Export Firebase Cloud Function for deployment (mapped in firebase.json)
export const api = onRequest(app);
