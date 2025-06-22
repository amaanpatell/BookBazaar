import { Router } from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../controllers/book.controllers.js";
import { isAdmin, verifyUser } from "../middlewares/auth.middlewares.js";
import { verifyApiKey } from "../middlewares/apiKey.middlewares.js";

const bookRoutes = Router();

bookRoutes.get("/", verifyUser, verifyApiKey, getAllBooks);

bookRoutes.get("/:id", verifyUser, verifyApiKey, getBookById);

// Admin Routes
bookRoutes.post("/", verifyUser, isAdmin, addBook);

bookRoutes.put("/:id", verifyUser, isAdmin, updateBook);

bookRoutes.delete("/:id", verifyUser, isAdmin, deleteBook);

export default bookRoutes;
