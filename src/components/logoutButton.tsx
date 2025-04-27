"use client"
import {signOut} from "next-auth/react"

function LogoutButton() {


  return (
    <button onClick={() => signOut({
        callbackUrl: "/login"
    })} 
    className='bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors'>
      Logout 
    </button>   
  )
}

export default LogoutButton