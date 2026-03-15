import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Income from '@/models/Income';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const incomes = await Income.find({ userId: session.user.id }).sort({ date: -1 }).limit(100);

    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    console.error('Fetch Incomes Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { amount, source, date, note } = await req.json();

    if (!amount || !source) {
      return NextResponse.json(
        { message: 'Please provide amount and source' },
        { status: 400 }
      );
    }

    await connectDB();

    const income = await Income.create({
      userId: session.user.id,
      amount,
      source,
      date: date || new Date(),
      note,
    });

    return NextResponse.json(income, { status: 201 });
  } catch (error) {
    console.error('Create Income Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
