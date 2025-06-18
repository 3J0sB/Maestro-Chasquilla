/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface RequestStatusData {
  name: string;
  value: number;
  color: string;
}

interface RequestStatusChartProps {
  data: RequestStatusData[];
}

const RequestStatusChart: React.FC<RequestStatusChartProps> = ({ data }) => {
  // Calcular el total
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Solicitudes por Estado
        </h2>
        <span className="text-sm text-gray-500">
          Total: {total} solicitudes
        </span>
      </div>
      
      <div className="w-full h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            <Tooltip
              formatter={(value) => [`${value} solicitudes`, '']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-4">
        {data.map((status) => (
          <div key={status.name} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {status.name}
                </span>
              </div>
              <div className="text-sm font-semibold">
                {status.value}
              </div>
            </div>
            <div className="mt-1 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${(status.value / total * 100)}%`,
                  backgroundColor: status.color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestStatusChart;