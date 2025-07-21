import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ProfileBudget from "@/models/ProfileBudget";
import ProfileTransaction from "@/models/ProfileTransaction";
import { VALIDATION_CONFIG } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    const groupId = searchParams.get('groupId');
    const viewMode = searchParams.get('viewMode') || 'individual';

    let budgetQuery: any = {};
    let transactionQuery: any = {};

    if (viewMode === 'group' && groupId) {
      budgetQuery.groupId = groupId;
      transactionQuery.groupId = groupId;
    } else if (viewMode === 'individual' && profileId) {
      budgetQuery.profileId = profileId;
      transactionQuery.profileId = profileId;
    } else {
      return NextResponse.json(
        { error: "Profile ID or Group ID is required" },
        { status: 400 }
      );
    }

    const budgets = await ProfileBudget.find(budgetQuery).lean();

    // Calculate current spending for each budget
    const currentMonth = new Date().toISOString().slice(0, 7);
    transactionQuery.type = "expense";
    transactionQuery.date = { $regex: `^${currentMonth}` };

    const monthlyExpenses = await ProfileTransaction.aggregate([
      { $match: transactionQuery },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
        },
      },
    ]);

    const expenseMap = monthlyExpenses.reduce((acc, item) => {
      acc[item._id] = item.spent;
      return acc;
    }, {} as Record<string, number>);

    const updatedBudgets = budgets.map((budget) => {
      const spent = expenseMap[budget.category] || 0;
      const remaining = Math.max(0, budget.amount - spent);
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        ...budget,
        spent,
        remaining,
        percentage: Math.min(100, Math.max(0, percentage)),
      };
    });

    return NextResponse.json(updatedBudgets);
  } catch (error) {
    console.error("Error fetching profile budgets:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch budgets",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Validate input
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

    if (!Array.isArray(body.budgets)) {
      return NextResponse.json(
        { error: "Budgets must be an array" },
        { status: 400 }
      );
    }

    // Validate each budget
    for (const budget of body.budgets) {
      if (!budget.category || typeof budget.category !== "string" || budget.category.trim() === "") {
        return NextResponse.json(
          { error: "Each budget must have a valid category" },
          { status: 400 }
        );
      }

      if (!budget.amount || typeof budget.amount !== "number" || budget.amount < VALIDATION_CONFIG.minAmount) {
        return NextResponse.json(
          { error: "Each budget must have a valid amount greater than 0.01" },
          { status: 400 }
        );
      }

      if (budget.amount > VALIDATION_CONFIG.maxAmount) {
        return NextResponse.json(
          { error: `Budget amount cannot exceed ${VALIDATION_CONFIG.maxAmount}` },
          { status: 400 }
        );
      }
    }

    // Check for duplicate categories
    const categories = body.budgets.map((b: any) => b.category.trim().toLowerCase());
    const uniqueCategories = new Set(categories);
    if (categories.length !== uniqueCategories.size) {
      return NextResponse.json(
        { error: "Duplicate budget categories are not allowed" },
        { status: 400 }
      );
    }

    // Clear existing budgets for this profile and create new ones
    await ProfileBudget.deleteMany({ profileId: body.profileId });

    const sanitizedBudgets = body.budgets.map((budget: any) => ({
      profileId: body.profileId,
      groupId: body.groupId,
      category: budget.category.trim(),
      amount: Number(budget.amount.toFixed(2)),
    }));

    const savedBudgets = await ProfileBudget.insertMany(sanitizedBudgets);
    return NextResponse.json(savedBudgets, { status: 201 });
  } catch (error: any) {
    console.error("Error saving profile budgets:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to save budgets",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}