import { auth } from '@/auth'
import React from 'react'
import AccessDenied from '@/components/Access-denied/access-denied'
import AdminUsersManagement from '../../../../components/layout/admin-components/admin-users-management'

async function AdminUsersPage() {
    const session = await auth()
    
    if (session?.user.role !== 'ADMIN') {
      return(      
      <div>
        <AccessDenied message="No tienes permisos para acceder a esta página 🧐"/>
      </div>) 
    }
   
    return <AdminUsersManagement session={session} />
}

export default AdminUsersPage
