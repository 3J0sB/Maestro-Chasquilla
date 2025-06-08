import Image from "next/image";
import React from "react";

interface ServiceDetailDescriptionProps {
  description?: string | null;
  serviceImage?: string | null;
}

export default function ServiceDetailDescription({description, serviceImage}: ServiceDetailDescriptionProps) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-10">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-800">Descripción Detallada</h2>

      </div>
      <p className="text-gray-700 mb-4">
        {description}
      </p>
      <div>
        
      </div>
      <div className="flex justify-center mt-4 rounded-lg overflow-hidden">
        {/* Imagen de ambiente, SVG de sala */}
        <Image src={serviceImage || ''} height={300} width={300} alt="service-image"/>
      </div>
    </div>
  );
}