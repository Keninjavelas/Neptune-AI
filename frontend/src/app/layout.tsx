import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AquaFlow AI',
  description: 'AI-powered smart water leak detection and automatic response system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

