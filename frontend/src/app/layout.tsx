import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Create and manage your tasks',
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
