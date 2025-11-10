'use client';

import { usePathname } from 'next/navigation';
import AppShell from '@/components/app-shell';
import React from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-background">
        {children}
      </main>
    );
  }

  return <AppShell>{children}</AppShell>;
}
