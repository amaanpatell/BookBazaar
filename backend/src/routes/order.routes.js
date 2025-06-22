import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middlewares.js";
import { verifyApiKey } from "../middlewares/apiKey.middlewares.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
} from "../controllers/order.controllers.js";

const orderRoutes = Router();

orderRoutes.post("/", verifyUser, verifyApiKey, createOrder);

orderRoutes.get("/", verifyUser, verifyApiKey, getAllOrders);

orderRoutes.get("/:id", verifyUser, verifyApiKey, getOrderById);

orderRoutes.delete("/:id", verifyUser, verifyApiKey, deleteOrder);

export default orderRoutes;
