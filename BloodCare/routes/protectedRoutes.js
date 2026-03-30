import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const protectedRoutes = express.Router();

/* protectedRoutes.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You are authorized to access this protected resource.'});
}); */

export default protectedRoutes;