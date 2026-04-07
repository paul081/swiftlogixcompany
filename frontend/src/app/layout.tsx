import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/store/AuthContext';
import Link from 'next/link';
import { Package } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';
import ServicesModal from '@/components/ServicesModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | SwiftLogix Global',
    default: 'SwiftLogix | Global Package Tracking & Logistics',
  },
  description: 'SwiftLogix provides premium, real-time global package tracking and logistics solutions. Ship smarter, track faster, and settle for nothing less than excellence.',
  keywords: ['logistics', 'package tracking', 'shipping', 'global delivery', 'supply chain', 'swiftlogix'],
  authors: [{ name: 'SwiftLogix Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
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
          <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-24 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
              <Link href="/" className="flex items-center gap-1">
                <span className="text-3xl font-black text-[#005a82] tracking-tighter">swift<span className="text-blue-600">●</span>logix</span>
              </Link>
              
              <div className="hidden lg:flex items-center gap-10">
                <Link href="/" className="text-slate-600 hover:text-blue-600 font-bold transition-colors">Home</Link>
                <a href="#services" className="text-slate-600 hover:text-blue-600 font-bold transition-colors">Services</a>
                <a href="#pricing" className="text-slate-600 hover:text-blue-600 font-bold transition-colors">Pricing</a>
                <button 
                  onClick={() => (window as any).dispatchServicesEvent?.()} 
                  className="text-slate-600 hover:text-blue-600 font-bold transition-colors"
                >
                  Track Shipment
                </button>
                <Link href="/" className="text-slate-600 hover:text-blue-600 font-bold transition-colors">About Us</Link>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/login" className="px-8 py-3 bg-[#005a82] text-white font-bold rounded-lg hover:bg-[#004a6b] transition-all shadow-lg shadow-blue-900/10">Log In</Link>
                <Link href="/signup" className="px-8 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all">Sign Up</Link>
              </div>
            </div>
          </nav>
          <div className="pt-20">
            {children}
          </div>
          <ChatWidget />
          <ServicesModal />
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
