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
        ? "border border-orange-500 text-orange-500 font-medium"
        : "text-gray-600 hover:bg-gray-100"
        }`}
      title={collapsed ? text : ''}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && <span className="truncate">{text}</span>}
    </Link>
  );
};

function ServiceProviderSidebar({ userName, userType, userLastName, userImage }: SidebarProps) {
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
          <Link href="/service-provider/home" className={`flex items-center ${collapsed ? '' : 'gap-2'}`}>
            <Image
              src="/img/miau.jpg"
              width={40}
              height={40}
              alt='Maestro Chasquilla logo'
              className="rounded-full"
            />
            {!collapsed && (
              <span className="font-bold text-lg">
                Maestro <span className="text-orange-500">Chasquilla</span>
              </span>
            )}
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink
            href="/service-provider/home"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            }
            text="Dashboard"
            active={pathname === "/service-provider/home"}
            collapsed={collapsed}
          />

          <SidebarLink
            href="/service-provider/service-config"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            }
            text="Servicios"
            active={pathname.startsWith("/service-provider/service-config")}
            collapsed={collapsed}
          />

          <SidebarLink
            href="/service-provider/request"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
            text="Solicitudes"
            active={pathname.startsWith("/service-provider/request")}
            collapsed={collapsed}
          />

          <SidebarLink
            href="/service-provider/messages"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
            text="Mensajes"
            active={pathname === "/service-provider/messages"}
            collapsed={collapsed}
          />


          <SidebarLink
            href="/service-provider/profile"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            text="Perfil"
            active={pathname === "/service-provider/profile"}
            collapsed={collapsed}
          />

          <SidebarLink
            href="/service-provider/provider-config"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            text="Configuración"
            active={pathname === "/service-provider/provider-config"}
            collapsed={collapsed}
          />

        </nav>

        {/* User Profile */}
        <div className={`p-4 border-t border-gray-200 ${collapsed ? 'items-center justify-center' : ''}`}>
          {!collapsed ? (
            <Link href="/service-provider/profile" className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={userImage || '/img/miau.jpg'}
                  alt={`${userName} ${userLastName}`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">{userName} {userLastName}</p>
                <p className="text-xs text-gray-500">
                  {userType === 'SERVICE_PROVIDER' ? 'Proveedor de servicios' : userType}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={userImage || '/img/miau.jpg'}
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
        className="absolute top-4  z-10 p-1 rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition-all duration-300"
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

export default ServiceProviderSidebar;