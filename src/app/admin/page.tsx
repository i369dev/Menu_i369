'use client';

import React from 'react';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const handleExit = () => {
    router.push('/');
  };
  
  return (
    <div className="bg-gray-50">
        <AdminDashboard onExit={handleExit} />
    </div>
  );
}
