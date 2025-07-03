import { auth } from '@/auth'
import React from 'react'
import AccessDenied from '@/components/Access-denied/access-denied'
import AdminReportsModeration from '@/components/layout/admin-components/admin-reports-moderation'

async function AdminReportsPage() {
    const session = await auth()
    
    if (session?.user.role !== 'ADMIN') {
      return(      
      <div>
        <AccessDenied message="No tienes permisos para acceder a esta página 🧐"/>
      </div>) 
    }
   
    return <AdminReportsModeration session={session} />
}

export default AdminReportsPage