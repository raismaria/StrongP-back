import { Router } from "express";
import { CheckAuth, isAdmin } from "../middlewares/auth.js";
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminProducts,
} from "../handlers/admin.js";

const adminRouter = Router();

// Protect all admin routes with authentication and admin check
adminRouter.use(CheckAuth, isAdmin);

// Dashboard stats
adminRouter.get("/stats", getDashboardStats);

// Users management
adminRouter.get("/users", getAllUsers);
adminRouter.put("/users/:id/role", updateUserRole);
adminRouter.delete("/users/:id", deleteUser);

// Categories management
adminRouter.get("/categories", getAllCategories);
adminRouter.post("/categories", createCategory);
adminRouter.put("/categories/:id", updateCategory);
adminRouter.delete("/categories/:id", deleteCategory);

// Products management (admin view)
adminRouter.get("/products", getAdminProducts);

export default adminRouter;
