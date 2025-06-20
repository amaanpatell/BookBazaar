import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
    },
    publisher: {
      type: String,
    },
    publicationDate: {
      type: Date,
    },
    industryIdentifiers: {
      type: {
        type: String,
        identifier: String,
      },
    },
    description: {
      type: String,
    },
    category: {
      type: Array,
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock cannot be negative"],
    },
    coverImage: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
