import React from 'react';


interface StatCardsProps {
    stats: {
        totalServices: number;
        averageRating: number;
        pendingRequests: number;
        completedRequests: number;
        estimatedRevenue: number;
        totalReviews: number;
    };
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP'
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">
                            Servicios Activos
                        </p>
                        <div className="flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats.totalServices}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">
                            Calificación Promedio
                        </p>
                        <div className="flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats.averageRating.toFixed(1)}
                            </p>
                            <span className="ml-2 text-sm text-gray-500">
                                ({stats.totalReviews} reseñas)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-orange-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4"></polyline>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                        </svg>                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">
                            Solicitudes Pendientes
                        </p>
                        <div className="flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">
                                {stats.pendingRequests}
                            </p>
                            <span className="ml-2 text-sm text-gray-500">
                                ({stats.completedRequests} completadas)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="1" x2="12" y2="23"></line>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500">
                            Ingresos Estimados
                        </p>
                        <div className="flex items-baseline">
                            <p className="text-2xl font-semibold text-gray-900">
                                {formatCurrency(stats.estimatedRevenue)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatCards;