import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Block Website',
  description: 'Built with Next.js and @cheryx2020/core',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
