import React from "react";


interface ServiceMainInfoProps {
  title: string;
  servicePrice: number | null;
  serviceTag1: string | null;
  serviceTag2: string | null;
  serviceTag3: string | null;
  userImage: string | null;
  serviceSmallDescription?: string | null;
 
}

export default function ServiceMainInfo({ title,  servicePrice,  serviceSmallDescription,serviceTag1, serviceTag2, serviceTag3, userImage }: ServiceMainInfoProps) {
  
  console.log('ServiceMainInfo props:', {
    title,
    servicePrice,
    serviceTag1,
    serviceTag2,
    serviceTag3,
    userImage,
    serviceSmallDescription
  });
  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <span className="text-2xl font-bold text-gray-800">${servicePrice}</span>
            {/* <span className="text-gray-500">/sesión</span> */}
            <span className="flex items-center gap-1 text-gray-500">
              {/* Reloj SVG */}
              {/* <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2" />
                <path d="M12 8v4l3 2" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              60 min */}
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              {/* Casa SVG */}
              {/* <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M3 9.75V21h6v-6h6v6h6V9.75L12 3 3 9.75z" stroke="#9CA3AF" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              Solo en consulta */}
            </span>
          </div>
          <p className="text-gray-700 mb-3">
            {serviceSmallDescription}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {
              serviceTag1 && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{serviceTag1}</span>
              )
            }
            {
              serviceTag2 && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{serviceTag2}</span>
              )
            }
            {
              serviceTag3 && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{serviceTag3}</span>
              )
            } 
          </div>
        </div>
      </div>
    </div>
  );
}