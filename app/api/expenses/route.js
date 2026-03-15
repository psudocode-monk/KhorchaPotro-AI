import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Expense from '@/models/Expense';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Sort by date descending by default
    const expenses = await Expense.find({ userId: session.user.id }).sort({ date: -1 }).limit(100);

    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error('Fetch Expenses Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { amount, category, paymentMode, date, note } = await req.json();

    if (!amount || !category || !paymentMode) {
      return NextResponse.json(
        { message: 'Please provide amount, category and payment mode' },
        { status: 400 }
      );
    }

    await connectDB();

    const expense = await Expense.create({
      userId: session.user.id,
      amount,
      category,
      paymentMode,
      date: date || new Date(),
      note,
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Create Expense Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
