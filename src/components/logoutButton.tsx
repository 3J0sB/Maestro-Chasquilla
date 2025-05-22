"use client"
import {signOut} from "next-auth/react"
import Image from "next/image"

function LogoutButton() {


  return (
    <button onClick={() => signOut({
        callbackUrl: "/login"
    })} 
    className='w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-2 text-orange-500 bg-red-50 hover:bg-red-100 rounded transition-colors'>
      <Image
        src={"/icons/logout-variant.svg"}
        alt="logout-icon"
        width={20}
        height={20}
      />
     Salir
    </button>   
  )
}

export default LogoutButton