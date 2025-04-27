import LogoutButton from '@/components/logoutButton'
import React from 'react'

function Home() {
  return (
    <div>
      <header className='bg-amber-200 h-16 flex justify-end items-center px-4'>
          <LogoutButton/>
      </header>
        <h1 className='text-2xl font-bold'>Home Page</h1>
      <div>home</div>
    </div>
  )
}

export default Home