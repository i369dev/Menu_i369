'use client';

import React from 'react';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { LoginView } from '@/app/components/admin/LoginView';
import { Card } from '@/app/components/admin/ui/AdminShared';

export default function AdminPage() {
  const router = useRouter();
  // මෙහි logout එකද අලුතින් එකතු කර ඇත
  const { user, appUser, loading, logout } = useAuth(); 

  const handleExit = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    await logout(); // ගිණුමෙන් ඉවත් වීම
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse">Authenticating...</p>
      </div>
    );
  }

  // පරිශීලකයෙක් නැත්නම් කෙලින්ම Login තිරය පෙන්වන්න
  if (!user || !appUser) {
    return <LoginView onExit={handleExit} />;
  }

  // ලොග් වී සිටින කෙනා Super Admin නොවේ නම් මේ තිරය පෙන්වයි
  if (appUser.role !== 'Super Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You do not have the required permissions to view this page.</p>
            <div className="flex flex-col gap-4 items-center mt-4">
                <button onClick={handleExit} className="text-sm font-bold text-blue-600 hover:underline">
                  Return to Homepage
                </button>
                {/* අලුතින් එකතු කළ Logout බොත්තම */}
                <button onClick={handleLogout} className="text-sm font-bold text-red-600 hover:underline bg-red-50 px-4 py-2 rounded-md">
                  Logout & Try Another Account
                </button>
            </div>
        </Card>
      </div>
    );
  }
 
  // Super Admin කෙනෙක් නම් Dashboard එක පෙන්වයි
  return (
    <div className="bg-gray-50">
      <AdminDashboard onExit={handleExit} />
    </div>
  );
}