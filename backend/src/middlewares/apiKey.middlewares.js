import { ApiKey } from "../models/apiKey.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

export const verifyApiKey = asyncHandler(async (req, res, next) => {
  const key = req.headers["x-api-key"];
  if (!key) {
    throw new ApiError(401, "API key missing");
  }

  const apiKey = await ApiKey.findOne({ key, isActive: true });

  if (!apiKey || apiKey.expiresAt < new Date()) {
    throw new ApiError(403, "API key invalid or expired");
  }

  req.apiKey = apiKey;
  next();
});
