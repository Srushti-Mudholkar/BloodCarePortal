import express from 'express';
import { registerContrroller, loginContrroller, currentUserController } from '../controllers/authController.js';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const authrouter = express.Router();

// routes
// REGISTER ROUTES POST
authrouter.post('/register', registerContrroller);

// LOGIN ROUTES POST
authrouter.post('/login', loginContrroller);

// GET CURRENT USER || GET
authrouter.get('/current-user', authMiddleware, currentUserController);

export default authrouter;