import express, { Request, Response } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import messagesRouter from './routes/messages';

// Import auth middleware to ensure Express.Request is extended with uid
import './middleware/auth';

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10kb' }));

// Rate limiting for messages
const messageRateLimit = rateLimit({
  windowMs: 60 * 1000,     // 1 minute
  max: 10,                 // 10 messages per minute
  message: { error: 'Too many messages. Try again in a minute.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.uid || req.ip || 'unknown',
});

// Routes
app.use('/api/messages', messageRateLimit, messagesRouter);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
