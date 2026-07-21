import express from "express";
import {
  registerController,
  loginController,
  currentUserController,
  verifyEmailController,
} from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const authRouter = express.Router();

// POST /api/v1/auth/register
authRouter.post("/register", validate(registerSchema), registerController);

// POST /api/v1/auth/login
authRouter.post("/login", validate(loginSchema), loginController);

// GET /api/v1/auth/current-user
authRouter.get("/current-user", authMiddleware, currentUserController);

// GET /api/v1/auth/verify-email/:token
authRouter.get("/verify-email/:token", verifyEmailController);

export default authRouter;
