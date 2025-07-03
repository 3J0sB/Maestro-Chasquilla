'use client'
import AccessDenied from '@/components/Access-denied/access-denied'
import ServiceProviderSidebar from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar'
import ServiceProviderMobileDrawer from '@/components/layout/Service-provider-components/Service-provider-sidebar/service-provider-sidebar-mobile'
import { se } from 'date-fns/locale'
import { useSession } from 'next-auth/react'

export default function ServiceProviderLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

    if (session?.user.role !== 'SERVICE_PROVIDER') {
      return(      
      <div>
        <AccessDenied message="Esta no deberias estar aqui 🥸"/>
      </div>) 

    }

  return (
    <div className="h-screen flex flex-col md:flex-row bg-gradient-to-tr from-white/50 to-white">

      <div className="md:hidden">
        <ServiceProviderMobileDrawer
          userName={session?.user.name || ''}
          userType={session?.user.role || ''}
          userLastName={session?.user.lastName || ''}
          userImage={session?.user.image || ''}
        />
      </div>

      <aside className="hidden md:block h-full md:h-screen ">
        <ServiceProviderSidebar
          userName={session?.user.name || ''}
          userType={session?.user.role || ''}
          userLastName={session?.user.lastName || ''}
          userImage={session?.user.image || ''}
        />
      </aside>
      <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-10  overflow-y-auto">
        {children}
      </main>
    </div>
  )
}