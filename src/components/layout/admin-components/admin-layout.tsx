'use client';

import { Session } from 'next-auth';
import React from 'react';
import AdminSidebar from '@/components/layout/admin-components/Admin-sidebar/admin-sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  session: Session | null;
}

function AdminLayout({ children, session }: AdminLayoutProps) {
  const user = session?.user;

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar
        userName={user?.name || ''}
        userLastName={user?.lastName || ''}
        userType={user?.role || ''}
        userImage={user?.image || ''}
      />

      <main className="flex-1 overflow-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;
