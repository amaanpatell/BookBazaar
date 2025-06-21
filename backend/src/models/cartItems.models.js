import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", cartItemSchema);

export default CartItem;
