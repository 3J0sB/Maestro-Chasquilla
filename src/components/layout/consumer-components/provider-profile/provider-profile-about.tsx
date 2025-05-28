import React from 'react';

interface ProviderAboutProps {
  description: string;
 providerName?: string;
}

const ProviderAbout: React.FC<ProviderAboutProps> = ({
  description,
  providerName

}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Acerca de {providerName}</h2>
      <div className="text-gray-700 mb-4 whitespace-pre-line">
        {description}
      </div>
      
    </div>
  );
};

export default ProviderAbout;