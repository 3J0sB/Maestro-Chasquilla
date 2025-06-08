'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/logoutButton'

interface ConsumerSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userName: string
  userLastName: string
  userImage?: string
}

type SidebarLinkProps = {
  id: string;
  icon: React.ReactNode;
  text: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
};

const SidebarLink = ({ id, icon, text, active, collapsed, onClick }: SidebarLinkProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-4 py-3 rounded-lg transition-colors ${
        active
          ? "border border-orange-500 text-orange-500 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && <span className="truncate">{text}</span>}
    </button>
  );
};

export default function ConsumerSidebar({ activeTab, onTabChange, userName, userLastName, userImage }: ConsumerSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <aside className={`bg-white border-r border-gray-200 shadow-lg flex flex-col h-screen fixed ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
        {/* Logo */}
        <div className={`p-4 border-b border-gray-100 flex ${collapsed ? 'justify-center' : ''}`}>
          <Link href="/services" className={`flex items-center ${collapsed ? '' : 'gap-2'}`}>
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

        {/* Navegación principal */}
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink
            id="services"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
            text="Mis Servicios"
            active={activeTab === "services"}
            collapsed={collapsed}
            onClick={() => onTabChange('services')}
          />

          <SidebarLink
            id="messages"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            }
            text="Mensajes"
            active={activeTab === "messages"}
            collapsed={collapsed}
            onClick={() => onTabChange('messages')}
          />

          <SidebarLink
            id="settings"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            text="Configuración"
            active={activeTab === "settings"}
            collapsed={collapsed}
            onClick={() => onTabChange('settings')}
          />

          <div className="pt-2">
            <Link
              href="/services"
              className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100`}
            >
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
              </div>
              {!collapsed && <span className="truncate">Explorar Servicios</span>}
            </Link>
          </div>
        </nav>

        {/* Perfil de usuario */}
        <div className={`p-4 border-t border-gray-200 ${collapsed ? 'items-center justify-center' : ''}`}>
          {!collapsed ? (
            <div className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors">
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
                <p className="text-xs text-gray-500">Cliente</p>
              </div>
            </div>
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
          <div className="flex justify-center mt-4">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Botón para colapsar/expandir */}
      <button
        onClick={toggleSidebar}
        className="top-4 z-10 p-1 fixed rounded-full bg-white border border-gray-300 shadow-md hover:bg-gray-100 transition-all duration-300"
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
  )
}