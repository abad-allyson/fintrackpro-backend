import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Clerk identity
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Clerk profile data
    // Stored here for convenience/searching.
    // Clerk remains the source of truth.
    firstName: {
      type: String,
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    // Application-level fields
    // Your app owns these.

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    // User lifecycle
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
