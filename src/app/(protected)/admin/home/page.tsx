import { auth } from '@/auth'
import React from 'react'
import LogoutButton from '@/components/logoutButton'
import AccessDenied from '@/components/Access-denied/access-denied'


async function admin() {
    const session = await auth()
    // console.log("session", session)
    if (session?.user.role !== 'ADMIN') {
      return(      
      <div>
        <AccessDenied message="Esta no deberias estar aqui 🥸"/>
      </div>) 

    }
   
    return (
      <div className="container">
        <header>
            <LogoutButton/>
        </header>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    )
}

export default admin