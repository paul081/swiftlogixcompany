import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/store/AuthContext';
import Link from 'next/link';
import { Package } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SwiftLogix | Global Package Tracking',
  description: 'Logistics at the speed of thought. Premium shipping and tracking solutions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <nav className="fixed top-0 w-full z-50 glass border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter">SWIFTLOGIX</span>
              </Link>
              
              <div className="flex items-center gap-8">
                <Link href="/track" className="text-slate-400 hover:text-white font-medium transition-colors">Track</Link>
                <Link href="/services" className="text-slate-400 hover:text-white font-medium transition-colors">Services</Link>

              </div>
            </div>
          </nav>
          <div className="pt-20">
            {children}
          </div>
          <footer className="py-12 border-t border-slate-900 mt-20">
            <div className="max-w-7xl mx-auto px-6 text-center text-slate-500">
              <p>&copy; 2026 SwiftLogix Global Logistics. All rights reserved.</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
