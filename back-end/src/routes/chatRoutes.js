import express from 'express';
import { handleChat } from '../controllers/chatControllers.js';

const router = express.Router();

// The path here adds to the path in app.js.
// If app.js says '/api' and this says '/chat', the result is '/api/chat'
router.post('/chat', handleChat);

export default router;