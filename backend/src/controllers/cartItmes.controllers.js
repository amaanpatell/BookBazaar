import CartItem from "../models/cartItems.models";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ApiResponse } from "../utils/api-response";

export const addCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { bookId, quantity, price, title } = req.body;

  if (!bookId || !quantity || !price || !title) {
    throw new ApiError(400, "All fields are required");
  }

  let cartItem = await CartItem.findOne({ bookId, userId });

  if (cartItem) {
    //increase the quantityy
    cartItem.quantity += quantity;
  } else {
    cartItem = new CartItem({
      bookId,
      userId,
      quantity,
      price,
      title,
    });
  }

  await cartItem.save();

  res
    .status(201)
    .json(new ApiResponse(201, cartItem, "Cart item added successfully"));
});

export const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cartItems = await CartItem.find({ userId }).populate(
    "bookId",
    "title price"
  );

  if (!cartItems || cartItems.length === 0) {
    throw new ApiError(404, "No items found in the cart");
  }

  res
    .status(200)
    .json(new ApiResponse(200, cartItems, "Cart items retrieved successfully"));
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cartItemId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  const cartItem = await CartItem.findOne({
    _id: cartItemId,
    userId: req.user._id,
  });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  res
    .status(200)
    .json(new ApiResponse(200, cartItem, "Cart item updated successfully"));
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const cartItemId = req.params.id;

  const cartItem = await CartItem.findOneAndDelete({
    _id: cartItemId,
    userId: req.user._id,
  });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Cart item removed successfully"));
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await CartItem.deleteMany({ userId });

  res.status(200).json(new ApiResponse(200, null, "Cart cleared successfully"));
});
