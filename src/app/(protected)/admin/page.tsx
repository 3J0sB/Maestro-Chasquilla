import { auth } from '@/auth'
import React from 'react'
import LogoutButton from '@/components/logoutButton'
async function admin() {
    const session = await auth()
 
    if (!session) {
      return <div>Not authenticated</div>
    }
   
    return (
      <div className="container">
        <header>
            <LogoutButton></LogoutButton>
        </header>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </div>
    )
}

export default admin