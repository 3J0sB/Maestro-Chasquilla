import { auth } from '@/auth'
import React from 'react'
import AccessDenied from '@/components/Access-denied/access-denied'
import AdminReviewsModeration from '../../../../components/layout/admin-components/admin-reviews-moderation'

async function AdminReviewsPage() {
    const session = await auth()
    
    if (session?.user.role !== 'ADMIN') {
      return(      
      <div>
        <AccessDenied message="No tienes permisos para acceder a esta página 🧐"/>
      </div>) 
    }
   
    return <AdminReviewsModeration session={session} />
}

export default AdminReviewsPage
