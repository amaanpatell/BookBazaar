import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middlewares";
import { verifyApiKey } from "../middlewares/apiKey.middlewares";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
} from "../controllers/order.controllers";

const orderRoutes = Router();

orderRoutes.post("/add-order", verifyUser, verifyApiKey, createOrder);

orderRoutes.get("/getAllOrders", verifyUser, verifyApiKey, getAllOrders);

orderRoutes.get("/getOrder/:id", verifyUser, verifyApiKey, getOrderById);

orderRoutes.delete("/delete-order/:id", verifyUser, verifyApiKey, deleteOrder);

export default orderRoutes;
