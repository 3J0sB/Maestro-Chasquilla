'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/img/miau.jpg"
            width={60}
            height={60}
            alt='Maestro Chasquilla logo'
            className="rounded-full"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
        <p className="text-gray-600 mb-6">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        
        <div className="mb-8">
          <Image 
            src="/img/404.svg" 
            width={250} 
            height={250} 
            alt="Página no encontrada" 
            className="mx-auto"
            priority
          />
        </div>
        
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => router.back()} 
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Volver atrás
          </button>
          
          <Link 
            href="/" 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}