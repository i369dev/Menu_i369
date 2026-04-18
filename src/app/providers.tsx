'use client';

import { AuthProvider } from '@/app/context/AuthContext';
import { ContentProvider } from '@/app/context/ContentContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ContentProvider>
        {children}
      </ContentProvider>
    </AuthProvider>
  );
}