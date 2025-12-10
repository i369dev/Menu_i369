'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import { ContentProvider } from '@/app/context/ContentContext';

export default function AdminPage() {
  const router = useRouter();

  const handleExit = () => {
    router.push('/');
  };

  return (
    <ContentProvider>
        <div className="bg-gray-50">
            <AdminDashboard onExit={handleExit} />
        </div>
    </ContentProvider>
  );
}
