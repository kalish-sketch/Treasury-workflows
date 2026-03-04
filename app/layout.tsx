import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Treasurer Workflows — The World Before Nilus',
  description: 'Treasury workflow assessment tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
