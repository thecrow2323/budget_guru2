import mongoose from "mongoose";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/finance-utils";
import { VALIDATION_CONFIG } from "@/lib/constants";

const ProfileTransactionSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Profile ID is required"],
      index: true,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Group ID is required"],
      ref: 'UserGroup',
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [
        VALIDATION_CONFIG.minAmount,
        `Amount must be at least ${VALIDATION_CONFIG.minAmount}`,
      ],
      max: [
        VALIDATION_CONFIG.maxAmount,
        `Amount cannot exceed ${VALIDATION_CONFIG.maxAmount}`,
      ],
      validate: {
        validator: function (value: number) {
          return !isNaN(value) && isFinite(value);
        },
        message: "Amount must be a valid number",
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (value: string) {
          const date = new Date(value);
          return !isNaN(date.getTime()) && date <= new Date();
        },
        message: "Date must be a valid date and cannot be in the future",
      },
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [
        VALIDATION_CONFIG.minDescriptionLength,
        `Description must be at least ${VALIDATION_CONFIG.minDescriptionLength} characters`,
      ],
      maxlength: [
        VALIDATION_CONFIG.maxDescriptionLength,
        `Description cannot exceed ${VALIDATION_CONFIG.maxDescriptionLength} characters`,
      ],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["income", "expense"],
        message: 'Type must be either "income" or "expense"',
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [
        VALIDATION_CONFIG.maxCategoryLength,
        `Category cannot exceed ${VALIDATION_CONFIG.maxCategoryLength} characters`,
      ],
      minlength: [1, "Category cannot be empty"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound indexes for better query performance
ProfileTransactionSchema.index({ profileId: 1, type: 1, date: -1 });
ProfileTransactionSchema.index({ groupId: 1, type: 1, date: -1 });
ProfileTransactionSchema.index({ profileId: 1, category: 1, type: 1 });
ProfileTransactionSchema.index({ createdAt: -1 });

// Pre-save middleware for data sanitization
ProfileTransactionSchema.pre("save", function (next) {
  this.amount = Math.round((this.amount as number) * 100) / 100;
  this.description = this.description.trim();
  this.category = this.category.trim();
  next();
});

export default mongoose.models.ProfileTransaction ||
  mongoose.model("ProfileTransaction", ProfileTransactionSchema);