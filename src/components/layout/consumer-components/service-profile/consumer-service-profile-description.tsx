import Image from "next/image";
import React from "react";

export default function ServiceDetailDescription() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-10">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-800">Descripción Detallada</h2>

      </div>
      <p className="text-gray-700 mb-4">
        El mejor pan del fokin world, hecho con amor y dedicación.
      </p>
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">El servicio incluye</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 text-sm">
          <ul className="list-none space-y-1">
            <li className="flex items-center gap-2">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Pan amasado
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center mt-4 rounded-lg overflow-hidden">
        {/* Imagen de ambiente, SVG de sala */}
        <Image src={'/img/miau.jpg'} height={200} width={500} alt="service-image"/>
      </div>
    </div>
  );
}