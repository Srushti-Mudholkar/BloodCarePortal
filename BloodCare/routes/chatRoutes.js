import express from 'express';
import { chatController } from '../controllers/chatController.js';
import { authMiddleware} from '../middlewares/authMiddleware.js';

const chatRouter = express.Router();

chatRouter.post('/ask',authMiddleware,chatController);

export default chatRouter;