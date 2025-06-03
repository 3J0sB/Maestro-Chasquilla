import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RatingsDistributionProps {
  data: {
    rating: number;
    count: number;
  }[];
}

const RatingsDistribution: React.FC<RatingsDistributionProps> = ({ data }) => {
  // Ordenar los datos por calificación (5 → 1)
  const sortedData = [...data].sort((a, b) => b.rating - a.rating);
  
  // Calcular el total de reseñas
  const totalReviews = data.reduce((sum, item) => sum + item.count, 0);
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Distribución de Calificaciones
        </h2>
        <span className="text-sm text-gray-500">
          Total: {totalReviews} reseñas
        </span>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              dataKey="rating" 
              type="category" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value} ★`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} reseñas`, '']}
              labelFormatter={(label) => `${label} estrellas`}
            />
            <Bar 
              dataKey="count" 
              name="Cantidad" 
              fill="#fbbf24" 
              radius={[0, 4, 4, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      

    </div>
  );
};

export default RatingsDistribution;