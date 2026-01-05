import express from 'express';
import chatController from '../controllers/chat.controllers.js';
import chatMiddleware from '../middleware/chat.middleware.js';

const router = express.Router();

// get friends list
router.get('/getFriends', chatMiddleware, chatController.getFriends);

// create chat
router.post('/create', chatMiddleware, chatController.createChat);

// Send message
router.post('/message/send', chatMiddleware, chatController.messageSend);

// // Get messages of a chat
router.get('/messages/:chatId', chatMiddleware, chatController.getChats);

export default router;
