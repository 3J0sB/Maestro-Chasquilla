import { auth } from '@/auth'
import React from 'react'
import AccessDenied from '@/components/Access-denied/access-denied'
// Update the import path to match the actual file location and name
import AdminUsersManagement from '../../../../components/layout/admin-components/admin-users-management'

async function AdminUsersPage() {
    const session = await auth()
    
    if (session?.user.role !== 'ADMIN') {
      return(      
      <div>
        <AccessDenied message="No tienes permisos para acceder a esta página"/>
      </div>) 
    }
   
    return <AdminUsersManagement session={session} />
}

export default AdminUsersPage
