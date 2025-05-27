import React from 'react';

interface ProviderAboutProps {
  description: string;
  tags?: string[];
}

const ProviderAbout: React.FC<ProviderAboutProps> = ({
  description,
  tags = []
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Acerca de</h2>
      <div className="text-gray-700 mb-4 whitespace-pre-line">
        {description}
      </div>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, index) => (
            <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderAbout;