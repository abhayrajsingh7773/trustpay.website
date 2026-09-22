import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export const metadata: Metadata = {
  title: 'TrustPay — Payment Risk Intelligence',
  description:
    'Real-time payment risk analysis that learns your normal behavior, detects unusual transactions, and explains the risk before you pay.',
  keywords: 'payment security, fraud detection, risk analysis, fintech, UPI safety',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="app-shell">
          <Sidebar />
          <main className="main-content">{children}</main>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
