import { Order } from "../models/orders.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Book } from "../models/books.models.js"; 

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.postalCode
  ) {
    throw new ApiError(400, "Complete shipping address is required");
  }

  // Build orderItems array with verified prices from DB
  let verifiedItems = [];
  let totalAmount = 0;

  for (const item of orderItems) {
    const book = await Book.findById(item.bookId);
    if (!book) {
      throw new ApiError(404, `Book not found with ID: ${item.bookId}`);
    }

    const quantity = item.quantity || 1;
    const itemTotal = book.price * quantity;
    totalAmount += itemTotal;

    verifiedItems.push({
      bookId: book._id,
      quantity,
    });
  }

  if (totalAmount <= 0) {
    throw new ApiError(400, "Total amount must be greater than zero");
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    orderItems: verifiedItems,
    totalAmount,
    shippingAddress,
  });

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});


export const getAllOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
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
