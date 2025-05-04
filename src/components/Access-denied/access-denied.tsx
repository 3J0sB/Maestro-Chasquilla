'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface AccessDeniedProps {
  message?: string;
  redirectPath?: string;
  redirectLabel?: string;
}

const AccessDenied = ({
  message = "No tienes permiso para acceder a esta página",
  redirectPath = "/login",
  redirectLabel = "Volver al inicio"
}: AccessDeniedProps) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 max-w-md w-full text-center">

        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="mb-8">
          <Image 
            src="/icons/prohibited.svg" 
            width={200} 
            height={200} 
            alt="Acceso denegado" 
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
            href={redirectPath} 
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            {redirectLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;