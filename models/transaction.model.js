import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: [true, "Amount is required"] },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: [true, "Type is required"],
    },
    date: { type: Date, required: [true, "Date is required"] },
    category: {
      type: String,
      trim: true,
      maxlength: 100,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
      required: [true, "Description is required"],
    },
  },
  { timestamps: true },
);

// Hot paths for the list/filter queries.
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, type: 1 });

export default mongoose.model("Transaction", transactionSchema);
