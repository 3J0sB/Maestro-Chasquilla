import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

interface RequestTrendData {
  date: string;
  received: number;
  completed: number;
}

interface RequestsChartProps {
  data: RequestTrendData[];
}

const RequestsChart: React.FC<RequestsChartProps> = ({ data }) => {
  const [activeRange, setActiveRange] = useState('all');
  const [filteredData, setFilteredData] = useState<RequestTrendData[]>([]);
  
  const ranges = [
    { id: 'all', name: 'Todos' },
    { id: 'week', name: 'Esta Semana' },
    { id: 'month', name: 'Este Mes' }
  ];
  
  useEffect(() => {
    // Ordenar los datos por fecha
    const sortedData = [...data].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    let result;
    
    if (activeRange === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      result = data.filter(d => new Date(d.date) >= oneWeekAgo);
    } else if (activeRange === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      result = data.filter(d => new Date(d.date) >= oneMonthAgo);
    } else if (activeRange === 'all') {
      // Usamos todos los datos ordenados
      result = sortedData;
    }
    
    console.log(`Datos filtrados (${activeRange}):`, result);
    setFilteredData(result || []);
  }, [data, activeRange]);

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Tendencia de Solicitudes
        </h2>
        
        <div className="flex space-x-1">
          {ranges.map((range) => (
            <button
              key={range.id}
              onClick={() => setActiveRange(range.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded ${
                activeRange === range.id 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.name}
            </button>
          ))}
        </div>
      </div>
      
      {filteredData && filteredData.length > 0 ? (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(tick) => {
                  try {
                    const date = new Date(tick);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  } catch (error) {
                    console.error("Error en formato de fecha:", error);
                    return tick;
                  }
                }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value: number) => [`${value} solicitudes`, '']}
                labelFormatter={(label) => {
                  try {
                    const date = new Date(label);
                    return date.toLocaleDateString('es-CL');
                  } catch (error) {
                    console.error("Error en tooltip:", error);
                    return label;
                  }
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="received" 
                name="Recibidas"
                stroke="#f97316" 
                strokeWidth={2}
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="completed" 
                name="Completadas"
                stroke="#22c55e" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="w-full h-64 flex items-center justify-center text-gray-500">
          No hay datos disponibles para el período seleccionado
        </div>
      )}
    </div>
  );
};

export default RequestsChart;