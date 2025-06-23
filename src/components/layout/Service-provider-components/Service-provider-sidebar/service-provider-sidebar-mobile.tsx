'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import LogoutButton from '@/components/logoutButton'

type SidebarProps = {
  userName: string
  userLastName: string
  userType: string
  userImage: string
}

const links = [
  { href: '/service-provider/home', text: 'Dashboard', icon: /* ...svg... */ null },
  { href: '/service-provider/service-config', text: 'Servicios', icon: null },
  { href: '/service-provider/request', text: 'Solicitudes', icon: null },
  { href: '/service-provider/messages', text: 'Mensajes', icon: null },
  { href: '/service-provider/notifications', text: 'Notificaciones', icon: null },
  { href: '/service-provider/profile', text: 'Perfil', icon: null },
  { href: '/service-provider/provider-config', text: 'Configuración', icon: null },
]

function ServiceProviderMobileDrawer({ userName, userLastName, userType, userImage }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="fixed top-4 left-4 z-30 md:hidden bg-white p-2 rounded-full shadow"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
      >
        <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <Image src={userImage || '/img/miau.jpg'} width={40} height={40} alt="user" className="rounded-full" />
          <div>
            <p className="font-medium">{userName} {userLastName}</p>
            <p className="text-xs text-gray-500">{userType === 'SERVICE_PROVIDER' ? 'Proveedor de servicios' : userType}</p>
          </div>
          <button className="ml-auto" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            <svg width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-orange-100 text-orange-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setOpen(false)}
            >
              {/* Puedes poner aquí los SVGs de tus íconos */}
              <span>{link.text}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>
    </>
  )
}

export default ServiceProviderMobileDrawer