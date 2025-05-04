import { auth } from '@/auth'
import React from 'react'
import LogoutButton from '@/components/logoutButton'


async function admin() {
    const session = await auth()
    console.log("session", session)
    if (session?.user.role !== 'ADMIN') {
      return(      
      <div>
        <div>YOU R NOT AN ADMIN<LogoutButton/></div>
        <pre>{JSON.stringify(session, null, 2)}</pre>
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