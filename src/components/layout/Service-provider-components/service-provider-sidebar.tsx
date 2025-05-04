'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LogoutButton from '@/components/logoutButton';

type SidebarLinkProps = {
  href: string;
  icon: React.ReactNode;
  text: string;
  active?: boolean;
};

type SidebarProps = {
  userName: string;
  userType: string;
}

const SidebarLink = ({ href, icon, text, active }: SidebarLinkProps) => {
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? "bg-orange-50 text-orange-500 font-medium" 
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <div className="text-inherit">{icon}</div>
      <span>{text}</span>
    </Link>
  );
};

function ServiceProviderSidebar({userName, userType}: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <Link href="/home" className="flex items-center gap-2">
          <Image 
            src="/img/miau.jpg" 
            width={40} 
            height={40} 
            alt='Maestro Chasquilla logo' 
            className="rounded-full"
          />
          <span className="font-bold text-lg">
            Maestro <span className="text-orange-500">Chasquilla</span>
          </span>
        </Link>
      </div>
      
      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <SidebarLink 
          href="/serviceprovider/dashboard" 
          icon={
            <Image src={'icons/view-dashboard-outline.svg'} alt='dashboard' height={20} width={20}/>
          } 
          text="Dashboard" 
          active={pathname === "/serviceprovider/dashboard"}
        />
        
        <SidebarLink 
          href="/serviceprovider/services" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          } 
          text="Servicios" 
          active={pathname.startsWith("/serviceprovider/services")}
        />
        
        <SidebarLink 
          href="/serviceprovider/requests" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          } 
          text="Solicitudes" 
          active={pathname.startsWith("/serviceprovider/requests")}
        />
        
        <SidebarLink 
          href="/serviceprovider/calendar" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          } 
          text="Calendario" 
          active={pathname.startsWith("/serviceprovider/calendar")}
        />
        
        <div className="pt-6">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Ajustes
          </div>
        </div>
        
        <SidebarLink 
          href="/serviceprovider/profile" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          } 
          text="Perfil" 
          active={pathname === "/serviceprovider/profile"}
        />
        
        <SidebarLink 
          href="/serviceprovider/settings" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          } 
          text="Configuración" 
          active={pathname === "/serviceprovider/settings"}
        />
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/serviceprovider/profile" className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{userName}</p>
            <p className="text-xs text-gray-500">Cuenta {userType}</p>
          </div>
        </Link>
        <div className='flex justify-center mt-4'>
            <LogoutButton/>
        </div>
        
      </div>
    </aside>
  );
}

export default ServiceProviderSidebar;