'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginView from '@/app/components/admin/LoginView';
import { AdminDashboard } from '@/app/components/admin/AdminDashboard';
import Loader from '@/app/components/Loader';

export default function AdminPage() {
  const { user, loading } = useAuth();

  // 1. Loading අවස්ථාවේදී Loader එක පෙන්වන්න
  if (loading) {
    return <Loader />;
  }

  // 2. User කෙනෙක් නැත්නම් (ලොග් වෙලා නැත්නම්) කෙලින්ම Login තිරය පෙන්වන්න
  // මෙහිදී ඩේටාබේස් එක පරීක්ෂා නොකරන බැවින් Crash වීමක් සිදු නොවේ.
  if (!user) {
    return <LoginView />;
  }

  // 3. User කෙනෙක් ලොග් වෙලා ඉන්නවා නම් පමණක් Dashboard එක පෙන්වන්න
  return <AdminDashboard />;
}