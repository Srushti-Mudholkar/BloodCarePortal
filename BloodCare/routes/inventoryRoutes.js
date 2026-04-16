import express from "express";
import {
  createInventoryController,
  getInventoryController,
  getBloodGroupAvailabilityController,
  getDonorHistoryController,
  getHospitalHistoryController,
} from "../controllers/inventoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const inventoryRouter = express.Router();

// POST /api/v1/inventory/create  — organisation adds blood in/out
inventoryRouter.post("/create", authMiddleware, createInventoryController);

// GET /api/v1/inventory/get  — organisation views all records
inventoryRouter.get("/get", authMiddleware, getInventoryController);

// GET /api/v1/inventory/availability  — blood group wise availability
inventoryRouter.get("/availability", authMiddleware, getBloodGroupAvailabilityController);

// GET /api/v1/inventory/donor-history  — donor's own donation history
inventoryRouter.get("/donor-history", authMiddleware, getDonorHistoryController);

// GET /api/v1/inventory/hospital-history  — hospital's own request history
inventoryRouter.get("/hospital-history", authMiddleware, getHospitalHistoryController);

export default inventoryRouter;
