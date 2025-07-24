import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ProfileTransaction from "@/models/ProfileTransaction";
import { VALIDATION_CONFIG } from "@/lib/constants";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // Enhanced validation
    if (!body.profileId || typeof body.profileId !== "string") {
      return NextResponse.json(
        { error: "Profile ID is required" },
        { status: 400 }
      );
    }

    if (!body.groupId || typeof body.groupId !== "string") {
      return NextResponse.json(
        { error: "Group ID is required" },
        { status: 400 }
      );
    }

    if (!body.amount || typeof body.amount !== "number" || body.amount < VALIDATION_CONFIG.minAmount) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a number greater than 0.01" },
        { status: 400 }
      );
    }

    if (body.amount > VALIDATION_CONFIG.maxAmount) {
      return NextResponse.json(
        { error: `Amount cannot exceed ${VALIDATION_CONFIG.maxAmount}` },
        { status: 400 }
      );
    }

    if (!body.date || typeof body.date !== "string") {
      return NextResponse.json(
        { error: "Date is required and must be a valid date string" },
        { status: 400 }
      );
    }

    const transactionDate = new Date(body.date);
    if (isNaN(transactionDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (transactionDate > new Date()) {
      return NextResponse.json(
        { error: "Transaction date cannot be in the future" },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== "string" || body.description.trim().length < VALIDATION_CONFIG.minDescriptionLength) {
      return NextResponse.json(
        { error: `Description must be at least ${VALIDATION_CONFIG.minDescriptionLength} characters` },
        { status: 400 }
      );
    }

    if (body.description.trim().length > VALIDATION_CONFIG.maxDescriptionLength) {
      return NextResponse.json(
        { error: `Description cannot exceed ${VALIDATION_CONFIG.maxDescriptionLength} characters` },
        { status: 400 }
      );
    }

    if (!["income", "expense"].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be either "income" or "expense"' },
        { status: 400 }
      );
    }

    if (!body.category || typeof body.category !== "string" || body.category.trim() === "") {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    if (body.category.trim().length > VALIDATION_CONFIG.maxCategoryLength) {
      return NextResponse.json(
        { error: `Category cannot exceed ${VALIDATION_CONFIG.maxCategoryLength} characters` },
        { status: 400 }
      );
    }

    // Update transaction with sanitized data
    const updatedTransaction = await ProfileTransaction.findByIdAndUpdate(
      id,
      {
        profileId: body.profileId,
        groupId: body.groupId,
        amount: Number(body.amount.toFixed(2)),
        date: body.date,
        description: body.description.trim(),
        type: body.type,
        category: body.category.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTransaction);
  } catch (error: any) {
    console.error("Error updating profile transaction:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid transaction ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update transaction",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const deletedTransaction = await ProfileTransaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting profile transaction:", error);

    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid transaction ID format" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete transaction",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}