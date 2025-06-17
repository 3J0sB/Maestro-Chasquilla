import { auth } from '@/auth'
import React from 'react'
import AccessDenied from '@/components/Access-denied/access-denied'
// Update the import path and/or extension as needed, for example:
import AdminDashboard from '../../../../components/layout/admin-components/admin-dashboard'
// or, if the file is named 'admin-dashboard.tsx':
// import AdminDashboard from '@/components/admin-dashboard.tsx'


async function admin() {
    const session = await auth()
    // console.log("session", session)
    if (session?.user.role !== 'ADMIN') {
      return(      
      <div>
        <AccessDenied message="Esta no deberias estar aqui 🥸"/>
      </div>) 

    }
   
    return <AdminDashboard session={session} />
}

export default admin