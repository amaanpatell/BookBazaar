import Router from "express";
import { validate } from "../middlewares/validator.middlewares.js";
import {
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/index.js";
import {
  generateApiKey,
  loginUser,
  logoutUser,
  profile,
  registerUser,
} from "../controllers/auth.controllers.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

const authRoutes = Router();

authRoutes.post("/register", userRegistrationValidator(), validate, registerUser);

authRoutes.post("/login", userLoginValidator(), validate, loginUser);

authRoutes.post("/logout", verifyUser, logoutUser);

authRoutes.get("/profile", verifyUser, profile);

authRoutes.post("/api-key", verifyUser, generateApiKey);

export default authRoutes;
