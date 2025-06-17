'use client';

import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/components/logoutButton';

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  collapsed?: boolean;
};

type SidebarProps = {
  userName: string;
  userLastName: string;
  userType: string;
  userImage: string
}

const SidebarLink = ({ href, icon, text, active, collapsed }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${active
        ? "border border-blue-600 text-blue-600 font-medium"
        : "text-gray-600 hover:bg-gray-100"
        }`}
      title={collapsed ? text : ''}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && <span className="truncate">{text}</span>}
    </Link>
  );
};

function AdminSidebar({ userName, userType, userLastName, userImage }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <aside className={`bg-white border-r border-gray-200 shadow-lg flex flex-col ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
        {/* Logo */}
        <div className={`p-4 border-b border-gray-100 flex ${collapsed ? 'justify-center' : ''}`}>
          <Link href="/admin/home" className={`flex items-center ${collapsed ? '' : 'gap-2'}`}>
            <Image
              src="/img/miau.jpg"
              width={40}
              height={40}
              alt='Maestro Chasquilla logo'
              className="rounded-full"
            />
            {!collapsed && (
              <span className="font-bold text-lg">
                Admin <span className="text-blue-600">Panel</span>
              </span>
            )}
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink
            href="/admin/home"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            }
            text="Dashboard"
            active={pathname === "/admin/home"}
            collapsed={collapsed}
          />

          <SidebarLink
            href="/admin/services"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            text="Moderar Servicios"
            active={pathname.startsWith("/admin/services")}
            collapsed={collapsed}
          />

          <SidebarLink
            href="/admin/reviews"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            }
            text="Moderar Reviews"
            active={pathname.startsWith("/admin/reviews")}
            collapsed={collapsed}
          />
          
          <SidebarLink
            href="/admin/users"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            text="Gestión de Usuarios"
            active={pathname.startsWith("/admin/users")}
            collapsed={collapsed}
          />
    
        </nav>

        {/* User Profile */}
        <div className={`p-4 border-t border-gray-200 ${collapsed ? 'items-center justify-center' : ''}`}>
          {!collapsed ? (
            <Link href="/admin/profile" className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={userImage || '/img/default-user-image.png'}
                  alt={`${userName} ${userLastName}`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{userName} {userLastName}</p>
                <p className="text-xs text-gray-500">
                  {userType === 'ADMIN' ? 'Administrador' : userType}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={userImage || '/img/default-user-image.png'}
                  alt={`${userName}`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          <div className='flex justify-center mt-4'>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Botón para colapsar/expandir */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 z-10 p-1 rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition-all duration-300"
        style={{ left: collapsed ? '50px' : '245px' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {collapsed ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          )}
        </svg>
      </button>
    </>
  );
}

export default AdminSidebar;
