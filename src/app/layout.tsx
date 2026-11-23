import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MatVision AI | Folkstyle Wrestling Match & Film Analysis',
  description: 'AI-powered Folkstyle wrestling match breakdown: move recognition, scoring timeline, biomechanical coaching feedback, and custom drill generator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
