import React from 'react';


interface DashboardHeaderProps {
    providerName: string;
    timeRange: string;
    onTimeRangeChange: (range: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    providerName,
    timeRange,
    onTimeRangeChange
}) => {
    const currentDate = new Date().toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Hola, {providerName}
                        </h1>
                        <p className="text-sm text-gray-500 capitalize">{currentDate}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <select
                            value={timeRange}
                            onChange={(e) => onTimeRangeChange(e.target.value)}
                            className="bg-white border border-gray-300 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="7d">Últimos 7 días</option>
                            <option value="30d">Últimos 30 días</option>
                            <option value="90d">Últimos 90 días</option>
                            <option value="1y">Último año</option>
                        </select>


                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;