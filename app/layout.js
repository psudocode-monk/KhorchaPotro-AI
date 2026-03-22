import { Plus_Jakarta_Sans, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import AIChatBot from '@/components/AIChatBot';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });
const notoDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'], 
  variable: '--font-noto-devanagari',
  weight: ['400', '500', '700'] 
});

export const metadata = {
  title: 'IntelliSpend - AI Powered Expense Tracker',
  description: 'Smart expense tracking powered by AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} ${notoDevanagari.variable} bg-slate-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-500`}>
        <Providers>
          <Navbar />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          <AIChatBot />
        </Providers>
      </body>
    </html>
  );
}
