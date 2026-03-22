import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    // We do NOT want to explicitly return a 404 if the user doesn't exist
    // This prevents bad actors from enumerating valid email addresses in the system.
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent a reset link to it.' },
        { status: 200 }
      );
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash token to save in DB (for security against DB leaks)
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Token expires in 1 hour
    const resetPasswordExpires = Date.now() + 60 * 60 * 1000;

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    
    console.log("Token before save:", user.resetPasswordToken);
    await user.save();
    
    const checkUser = await User.findOne({ email });
    console.log("Token after save in DB:", checkUser.resetPasswordToken);

    // Construct Reset URL
    // Automatically determine base URL depending on execution environment
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    // Create Email Transporter (If no ENV is set, we still log it for dev)
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ SMTP Credentials missing in .env.local!');
        console.log('🔗 DEVELOPMENT MAGIC LINK:', resetUrl);
        // Continue and just pretend we sent it for local dev purposes
        return NextResponse.json(
            { message: 'If an account with that email exists, we have sent a reset link to it.' },
            { status: 200 }
        );
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or another service based on ENV, assuming Gmail initially
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"IntelliSpend" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
            <h2 style="color: #10B981; text-align: center;">IntelliSpend</h2>
            <p>You requested a password reset. Please click the button below to set a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #10B981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Reset Password</a>
            </div>
            <p style="font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent a reset link to it.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
