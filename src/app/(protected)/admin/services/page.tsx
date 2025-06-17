import { auth } from '@/auth'
import React from 'react'
import AccessDenied from '@/components/Access-denied/access-denied'
import AdminServicesModeration from '../../../../components/layout/admin-components/admin-services-moderation'

async function AdminServicesPage() {
    const session = await auth()
    
    if (session?.user.role !== 'ADMIN') {
      return(      
      <div>
        <AccessDenied message="No tienes permisos para acceder a esta página"/>
      </div>) 
    }
   
    return <AdminServicesModeration session={session} />
}

export default AdminServicesPage
