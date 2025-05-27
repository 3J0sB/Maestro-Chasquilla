import React from 'react';

interface ProviderStatsProps {
  projectsCompleted: number;
  yearsExperience: number;
  responseRate: number;
  ranking: string;
}

const ProviderStats: React.FC<ProviderStatsProps> = ({
  projectsCompleted,
  yearsExperience,
  responseRate,
  ranking
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Proyectos completados */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{projectsCompleted}</div>
          <div className="text-sm text-gray-500">Proyectos Completados</div>
        </div>
        
        {/* Años de experiencia */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{yearsExperience}</div>
          <div className="text-sm text-gray-500">Años de Experiencia</div>
        </div>
        
        {/* Tasa de respuesta */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{responseRate}%</div>
          <div className="text-sm text-gray-500">Tasa de Respuesta</div>
        </div>
        
        {/* Ranking */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{ranking}</div>
          <div className="text-sm text-gray-500">Ranking de Proveedor</div>
        </div>
      </div>
    </div>
  );
};

export default ProviderStats;