import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../handlers/orders.js";
import { CheckAuth } from "../middlewares/auth.js";

const orderRouter = Router();

// Protégé par auth
orderRouter.post("/", CheckAuth, createOrder);
orderRouter.get("/my", CheckAuth, getMyOrders);
orderRouter.get("/:id", CheckAuth, getOrderById);
orderRouter.put("/:id", CheckAuth, updateOrderStatus);

export default orderRouter;
