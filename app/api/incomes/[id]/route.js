import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Income from '@/models/Income';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { amount, source, date, note } = await req.json();

    await connectDB();

    const income = await Income.findOne({ _id: id, userId: session.user.id });

    if (!income) {
      return NextResponse.json({ message: 'Income not found' }, { status: 404 });
    }

    income.amount = amount || income.amount;
    income.source = source || income.source;
    income.date = date || income.date;
    income.note = note !== undefined ? note : income.note;

    await income.save();

    return NextResponse.json(income, { status: 200 });
  } catch (error) {
    console.error('Update Income Error:', error);
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

    const income = await Income.findOneAndDelete({ _id: id, userId: session.user.id });

    if (!income) {
      return NextResponse.json({ message: 'Income not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Income deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete Income Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
