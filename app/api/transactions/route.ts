import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { VALIDATION_CONFIG } from '@/lib/constants';

export async function GET() {
  try {
    await dbConnect();
    const transactions = await Transaction.find({})
      .sort({ createdAt: -1 })
      .limit(1000) // Limit to prevent memory issues
      .lean(); // Use lean() for better performance

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch transactions',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // Enhanced validation
    if (!body.amount || typeof body.amount !== 'number' || body.amount < VALIDATION_CONFIG.minAmount) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a number greater than 0.01' },
        { status: 400 }
      );
    }

    if (body.amount > VALIDATION_CONFIG.maxAmount) {
      return NextResponse.json(
        { error: `Amount cannot exceed ${VALIDATION_CONFIG.maxAmount}` },
        { status: 400 }
      );
    }

    if (!body.date || typeof body.date !== 'string') {
      return NextResponse.json(
        { error: 'Date is required and must be a valid date string' },
        { status: 400 }
      );
    }

    // Validate date format and future dates
    const transactionDate = new Date(body.date);
    if (isNaN(transactionDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (transactionDate > new Date()) {
      return NextResponse.json(
        { error: 'Transaction date cannot be in the future' },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length < VALIDATION_CONFIG.minDescriptionLength) {
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

    if (!['income', 'expense'].includes(body.type)) {
      return NextResponse.json(
        { error: 'Type must be either "income" or "expense"' },
        { status: 400 }
      );
    }

    if (!body.category || typeof body.category !== 'string' || body.category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    if (body.category.trim().length > VALIDATION_CONFIG.maxCategoryLength) {
      return NextResponse.json(
        { error: `Category cannot exceed ${VALIDATION_CONFIG.maxCategoryLength} characters` },
        { status: 400 }
      );
    }

    // Create transaction with sanitized data
    const transaction = new Transaction({
      amount: Number(body.amount.toFixed(2)), // Ensure 2 decimal places
      date: body.date,
      description: body.description.trim(),
      type: body.type,
      category: body.category.trim(),
    });

    const savedTransaction = await transaction.save();
    return NextResponse.json(savedTransaction, { status: 201 });
  } catch (error: any) {
    console.error('Error creating transaction:', error);

    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate transaction detected' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create transaction',
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}