import express from "express";
import {
  getAllDonorsController,
  getAllHospitalsController,
  getAllOrganisationsController,
  deleteUserController,
  getAdminStatsController,
} from "../controllers/adminController.js";
import { adminMiddleware } from "../middlewares/authMiddleware.js";

const adminRouter = express.Router();

// GET /api/v1/admin/donors
adminRouter.get("/donors", adminMiddleware, getAllDonorsController);

// GET /api/v1/admin/hospitals
adminRouter.get("/hospitals", adminMiddleware, getAllHospitalsController);

// GET /api/v1/admin/organisations
adminRouter.get("/organisations", adminMiddleware, getAllOrganisationsController);

// DELETE /api/v1/admin/delete-user/:id
adminRouter.delete("/delete-user/:id", adminMiddleware, deleteUserController);

// GET /api/v1/admin/stats
adminRouter.get("/stats", adminMiddleware, getAdminStatsController);

export default adminRouter;
