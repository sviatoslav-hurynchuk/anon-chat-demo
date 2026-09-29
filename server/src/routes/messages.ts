import { Router, Request, Response } from 'express';
import { MAX_MESSAGE_LENGTH, MessageRecord, CreateMessageResponse, ApiError } from '@anon-chat/shared';
import { db } from '../firebase-admin';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text } = req.body;

    // Validation
    if (typeof text !== 'string') {
      res.status(400).json({ error: 'Text must be a string' } as ApiError);
      return;
    }

    const trimmed = text.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({ error: `Text length must be between 1 and ${MAX_MESSAGE_LENGTH} characters` } as ApiError);
      return;
    }

    // Sanitization: Strip HTML tags requiring closing > to preserve expressions like 'a < b'
    const sanitizedText = trimmed.replace(/<[^>]*>/g, '').trim();

    if (sanitizedText.length === 0) {
      res.status(400).json({ error: 'Text is empty after sanitization' } as ApiError);
      return;
    }

    // Write to Realtime DB
    const messagesRef = db.ref('messages');
    const newRef = messagesRef.push();

    const record: MessageRecord = {
      text: sanitizedText,
      uid: req.uid!,
      createdAt: Date.now()
    };

    await newRef.set(record);

    res.status(201).json({
      id: newRef.key as string,
      message: 'Message created'
    } as CreateMessageResponse);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Internal server error' } as ApiError);
  }
});

export default router;
