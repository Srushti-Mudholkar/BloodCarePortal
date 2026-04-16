import express from "express";
import {
  registerController,
  loginController,
  currentUserController,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

// POST /api/v1/auth/register
authRouter.post("/register", registerController);

// POST /api/v1/auth/login
authRouter.post("/login", loginController);

// GET /api/v1/auth/current-user
authRouter.get("/current-user", authMiddleware, currentUserController);

export default authRouter;
