// routes/cart.routes.js
import { Router } from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartItmes.controllers.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const cartItem = Router();

cartItem.post("/add-to-cart", verifyUser, addToCart);

cartItem.get("/get-all-items", verifyUser, getUserCart);

cartItem.put("/cart/:id", verifyUser, updateCartItem);

cartItem.delete("/cart/:id", verifyUser, removeCartItem);

cartItem.delete("/cart", verifyUser, clearCart);

export default cartItem;
