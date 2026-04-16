import z from 'zod';
import userModel from '../models/userModel.js';

export const validateRegister = z.object({
  role: z.enum(role),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});