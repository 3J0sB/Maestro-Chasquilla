import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { service } from '@/types';
import { formatCLP } from '@/utils/format';

interface ProviderServicesProps {
    services: service[];
}

const SERVICES_PER_PAGE = 4;

const ProviderServices: React.FC<ProviderServicesProps> = ({
    services = []
}) => {
    console.log('ProviderServices component rendered with services:', services);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(services.length / SERVICES_PER_PAGE);
    const startIdx = (currentPage - 1) * SERVICES_PER_PAGE;
    const endIdx = startIdx + SERVICES_PER_PAGE;
    const paginatedServices = services.slice(startIdx, endIdx);

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Servicios ofrecidos</h2>
            </div>
            {services.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-gray-500 py-12 gap-4">
                    {/* SVG ilustrativo */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                    <span className="text-lg font-medium text-gray-600 text-center">
                        Este proveedor aún no ha publicado servicios disponibles.
                    </span>
                    <span className="text-sm text-gray-400 text-center">
                        Vuelve pronto para ver si ofrece nuevos servicios.
                    </span>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {paginatedServices.map((service) => (
                            <Link href={`/services/${service.id}`} key={service.id} className="block group">
                                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow hover:transform hover:scale-105">
                                    <div className="relative h-48">
                                        <Image
                                            src={service.image || '/img/miau.jpg'}
                                            alt={service.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col gap-2">
                                        <h3 className="font-bold text-gray-800 text-lg">{service.title}</h3>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            {service.serviceTag && (
                                                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                                    {service.serviceTag}
                                                </span>
                                            )}
                                            {service.serviceTag2 && (
                                                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                                    {service.serviceTag2}
                                                </span>
                                            )}
                                            {service.serviceTag3 && (
                                                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                                    {service.serviceTag3}
                                                </span>
                                            )}
                                        </div>
                                        {service.description && (
                                            <p className="text-gray-600 text-sm line-clamp-2">{service.description}</p>
                                        )}
                                        <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 mt-2">
                                            {service.price && (
                                                <span className="font-medium text-gray-900">
                                                    <span className="text-xs text-gray-500 mr-1">Precio base:</span> {formatCLP(service.price ?? 0)}
                                                </span>
                                            )}
                                            {service.minServicePrice !== undefined && (
                                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                                    Desde: {formatCLP(service.minServicePrice ?? 0)}
                                                </span>
                                            )}
                                            {service.maxServicePrice !== undefined && (
                                                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                                    Hasta: {formatCLP(service.maxServicePrice ?? 0)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex flex-col items-center gap-2 mt-8">
                            <div className="flex w-full justify-between items-center gap-2 sm:w-auto">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentPage === 1}
                                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                >
                                    Anterior
                                </button>
                                <span className="flex-1 sm:flex-none text-base text-gray-700 text-center select-none">
                                    Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
                                </span>
                                <button
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ProviderServices;