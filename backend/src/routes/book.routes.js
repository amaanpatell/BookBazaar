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

bookRoutes.get("/getAllBooks", verifyUser, verifyApiKey, getAllBooks);

bookRoutes.get("/getBook/:id", verifyUser, verifyApiKey, getBookById);

// Admin Routes
bookRoutes.post("/add-book", verifyUser, isAdmin, addBook);

bookRoutes.put("/update-book/:id", verifyUser, isAdmin, updateBook);

bookRoutes.delete("/delete-book/:id", verifyUser, isAdmin, deleteBook);

export default bookRoutes;
