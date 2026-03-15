import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter an email and password');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select('+password');

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (!user.password) {
            throw new Error('Please sign in with Google');
        }

        if (!user.isVerified) {
          throw new Error('Please verify your email to log in');
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);

        if (!isMatch) {
          throw new Error('Invalid email or password');
        }

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            console.log("Creating new user via Google:", user.email);
            // Ensure password is not required in schema. If schema is stale, this might fail.
            await User.create({
              name: user.name,
              email: user.email,
            });
            console.log("User created successfully");
          } else {
            console.log("User already exists, logging in:", user.email);
          }
          return true;
        } catch (error) {
          console.error("Error in Google Sign-In:", error);
          // Return true to allow sign in even if DB sync fails? No, that would be bad.
          // But we need to see the error.
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google') {
           // For Google users, we need to fetch the ID from DB if it wasn't just created
           // But wait, `user` object from Google provider might not have the MongoDB _id yet if we just created it?
           // Actually, NextAuth doesn't automatically fetch the DB user for OAuth unless we use an adapter.
           // So we should fetch the user from DB again to get the _id.
           await connectDB();
           const dbUser = await User.findOne({ email: user.email });
           if (dbUser) {
             token.id = dbUser._id.toString();
           }
        } else {
             token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
