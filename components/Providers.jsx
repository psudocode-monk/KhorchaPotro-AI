'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

export default function Providers({ children }) {
  return (
    <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            {children}
        </ThemeProvider>
    </SessionProvider>
  );
}
