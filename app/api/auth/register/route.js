import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Please provide all fields' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
         return NextResponse.json(
          { message: 'Account exists but is not verified. Please check your email for the verification link.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Even if email fails, user is created, but they can't login without verification.
      return NextResponse.json(
        { message: 'User created successfully, but failed to send verification email. Please contact support.' },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: 'User created successfully. Please check your email to verify your account.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error Details:', error);
    console.error('Registration Error Stack:', error.stack);
    return NextResponse.json(
      { message: 'Internal Server Error', error: error.message },
      { status: 500 }
    );
  }
}
