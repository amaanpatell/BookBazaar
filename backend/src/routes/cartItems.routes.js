import { Router } from "express";
import {
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  addCartItem,
} from "../controllers/cartItmes.controllers.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

const cartRoutes = Router();

cartRoutes.get("/", verifyUser, getUserCart);

cartRoutes.post("/", verifyUser, addCartItem);

cartRoutes.put("/:itemId", verifyUser, updateCartItem);

cartRoutes.delete("/:itemId", verifyUser, removeCartItem);

cartRoutes.delete("/", verifyUser, clearCart);

export default cartRoutes;
