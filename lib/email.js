import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verificationLink = `${appUrl}/verify?token=${token}`;

  const mailOptions = {
    from: `"IntelliSpend" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Please Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10B981; text-align: center;">Welcome to IntelliSpend!</h2>
        <p style="font-size: 16px; color: #374151;">Thank you for registering. We're excited to help you manage your finances intelligently.</p>
        <p style="font-size: 16px; color: #374151;">To get started, please click the secure link below to verify your email address. This link is unique to your account.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationLink}" style="background-color: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify My Email
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6B7280; text-align: center;">If you didn't request this email, you can safely ignore it.</p>
        <p style="font-size: 14px; color: #6B7280; text-align: center; margin-top: 30px;">
          Best Regards,<br>
          The IntelliSpend Team
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Could not send verification email');
  }
};
