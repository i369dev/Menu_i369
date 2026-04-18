'use client';

import React from 'react';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { LoginView } from '@/app/components/admin/LoginView';
import { Card } from '@/app/components/admin/ui/AdminShared';

export default function AdminPage() {
  const router = useRouter();
  const { appUser, loading } = useAuth();

  const handleExit = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (!appUser) {
    return <LoginView onExit={handleExit} />;
  }

  if (appUser.role !== 'Super Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You do not have the required permissions to view this page.</p>
            <button onClick={handleExit} className="text-sm font-bold text-blue-600 hover:underline">
              Return to Homepage
            </button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50">
      <AdminDashboard onExit={handleExit} />
    </div>
  );
}
