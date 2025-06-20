import { Book } from "../models/books.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";

export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find();
  res
    .status(200)
    .json(new ApiResponse(200, books, "Books fetched successfully"));
});

export const getBookById = asyncHandler(async (req, res) => {
  const bookId = req.params.id;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }
  res.status(200).json(new ApiResponse(200, book, "Book fetched successfully"));
});

// Admin Controllers
export const addBook = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    author,
    publisher,
    publicationDate,
    industryIdentifiers,
    description,
    category,
    price,
    stock,
    coverImage,
  } = req.body;

  // Validate required fields
  if (!title || !subtitle || !author || !category || stock === undefined) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Create a new book object
  const newBook = {
    title,
    subtitle,
    author,
    publisher,
    publicationDate,
    industryIdentifiers,
    description,
    category,
    price,
    stock,
    coverImage,
    createdBy: req.user._id,
  };

  // Save the book to the database
  const book = await Book.create(newBook);

  res.status(201).json(new ApiResponse(201, book, "Book added successfully"));
});

export const updateBook = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const {
    title,
    subtitle,
    author,
    publisher,
    publicationDate,
    industryIdentifiers,
    description,
    category,
    price,
    stock,
    coverImage,
  } = req.body;

  if (!title || !subtitle || !author || !category || stock === undefined) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const book = await Book.findById(bookId);
  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  // Update the book details
  book.title = title;
  book.subtitle = subtitle;
  book.author = author;
  book.publisher = publisher;
  book.publicationDate = publicationDate;
  book.industryIdentifiers = industryIdentifiers;
  book.description = description;
  book.category = category;
  book.price = price;
  book.stock = stock;
  book.coverImage = coverImage;
  book.updatedBy = req.user._id;

  const updatedBook = await book.save();
  res
    .status(200)
    .json(new ApiResponse(200, updatedBook, "Book updated successfully"));
});

export const deleteBook = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);

  if (!book) {
    throw new ApiError(404, "Book not found");
  }

  await book.deleteOne();

  res.status(200).json(new ApiResponse(200, null, "Book deleted successfully"));
});
