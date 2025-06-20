import crypto from "crypto";
import { User } from "../models/user.models.js";
import { ApiKey } from "../models/apiKey.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({ fullname, email, password });

  const accessToken = user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  // Set cookies for access and refresh tokens
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json(new ApiResponse(200, user, "User logged in successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  user.refreshToken = null;
  await user.save();

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "User logged out successfully"));
});

export const profile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user, "User profile retrieved successfully"));
});

export const generateApiKey = asyncHandler(async (req, res) => {
  const user = req.user;

  const rawKey = crypto.randomBytes(32).toString("hex");

  const apiKey = await ApiKey.create({
    key: rawKey,
    user: user._id,
  });

  res.status(201).json(new ApiResponse(201, apiKey, "API key generated"));
});

export const deleteApiKey = asyncHandler(async (req, res) => {
  const user = req.user;
  const { key } = req.body;

  if (!key) {
    throw new ApiError(400, "API key is required");
  }

  const deletedKey = await ApiKey.findOneAndDelete({
    key,
    user: user._id,
  });

  if (!deletedKey) {
    throw new ApiError(404, "API key not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedKey, "API key deleted successfully"));
});
