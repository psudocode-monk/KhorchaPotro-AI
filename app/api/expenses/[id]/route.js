import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Expense from '@/models/Expense';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { amount, category, paymentMode, date, note } = await req.json();

    await connectDB();

    const expense = await Expense.findOne({ _id: id, userId: session.user.id });

    if (!expense) {
      return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
    }

    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.paymentMode = paymentMode || expense.paymentMode;
    expense.date = date || expense.date;
    expense.note = note !== undefined ? note : expense.note;

    await expense.save();

    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.error('Update Expense Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const expense = await Expense.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!expense) {
      return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Expense deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete Expense Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
