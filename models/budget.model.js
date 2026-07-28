import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    monthlyLimit: { type: Number, required: true }, // cents
  },
  { timestamps: true }
);

// One budget per category per user.
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

export default mongoose.model("Budget", budgetSchema);
