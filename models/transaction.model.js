import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true }, // stored in cents
    type: { type: String, enum: ["income", "expense"], required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: "", trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// Hot paths for the list/filter queries.
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

export default mongoose.model("Transaction", transactionSchema);
