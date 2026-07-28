import express from "express";
import {
  getAllDonorsController,
  getAllHospitalsController,
  getAllOrganisationsController,
  deleteUserController,
  getAdminStatsController,
  getAdminInventoryController,
  getAdminOrgBreakdownController,
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

// GET /api/v1/admin/inventory — all inventory across all orgs
adminRouter.get("/inventory", adminMiddleware, getAdminInventoryController);

// GET /api/v1/admin/org-breakdown — blood group wise stock per organisation
adminRouter.get("/org-breakdown", adminMiddleware, getAdminOrgBreakdownController);

export default adminRouter;
