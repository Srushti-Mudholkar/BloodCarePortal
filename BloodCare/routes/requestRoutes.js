import express from "express";
import {
  createRequestController,
  getMyRequestsController,
  getOrgRequestsController,
  updateRequestStatusController,
} from "../controllers/requestController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const requestRouter = express.Router();

// POST /api/v1/request/create — donor or hospital creates a request
requestRouter.post("/create", authMiddleware, createRequestController);

// GET /api/v1/request/my-requests — donor or hospital sees their requests
requestRouter.get("/my-requests", authMiddleware, getMyRequestsController);

// GET /api/v1/request/org-requests — organisation sees all incoming requests
requestRouter.get("/org-requests", authMiddleware, getOrgRequestsController);

// PUT /api/v1/request/update-status/:id — organisation approves or rejects
requestRouter.put("/update-status/:id", authMiddleware, updateRequestStatusController);

export default requestRouter;
