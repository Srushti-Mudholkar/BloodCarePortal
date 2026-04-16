import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import testRouter from "./routes/testRoutes.js";
import protectedRouter from "./routes/protectedRoutes.js";
import requestRouter from "./routes/requestRoutes.js";
import userRouter from "./routes/userRoutes.js";

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/test", testRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/inventory", inventoryRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/protected", protectedRouter);
app.use("/api/v1/request", requestRouter);
app.use("/api/v1/user", userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).send({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.DEV_MODE} mode on port ${PORT}`.yellow.bold
  );
});
