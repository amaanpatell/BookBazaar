import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";

export const verifyUser = asyncHandler(async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken && !refreshToken) {
    throw new ApiError(401, "Unauthorized - No tokens provided");
  }

  try {
    // Try to verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) throw new ApiError(401, "User not found");
    req.user = user;
    return next();
  } catch (err) {
    // Access token failed, try refresh token
    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized - Access token expired");
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findById(decodedRefresh._id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new ApiError(401, "Unauthorized - Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = await user.generateAccessToken();
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      req.user = user;
      next();
    } catch (refreshErr) {
      throw new ApiError(401, "Unauthorized - Refresh token expired");
    }
  }
});
