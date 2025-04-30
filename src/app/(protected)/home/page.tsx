import LogoutButton from '@/components/logoutButton'
import Image from 'next/image';
import React from 'react';


function Home() {
  return (
    <div>
      <header className='bg-amber-200 h-16 flex justify-end items-center px-4'>
        <LogoutButton />
      </header>
      <h1 className='text-2xl font-bold'>Home Page</h1>
      <div>home</div>
      <Image
        src="/img/welcome.svg"
        width={250}
        height={250}
        alt='welcome image'
      />
    </div>
  )
}

export default Home