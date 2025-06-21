import { Order } from "../models/orders.models";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, "Order items are required");
  }
  if (!totalAmount || totalAmount <= 0) {
    throw new ApiError(400, "Total amount must be greater than zero");
  }
  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode
  ) {
    throw new ApiError(400, "Shipping address is required");
  }

  const totalAmount = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  if (totalAmount <= 0) {
    throw new ApiError(400, "Total amount must be greater than zero");
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalAmount,
    shippingAddress,
  });

  if (!order) {
    throw new ApiError(500, "Failed to create order");
  }

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate("orderItems.book", "title author price")
    .sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found for this user");
  }

  res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;

  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate("orderItems.book", "title author price")
    .populate("user", "name email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;

  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  const order = await Order.findOneAndDelete({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});
