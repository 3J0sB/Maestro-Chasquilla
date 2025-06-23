import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { service } from '@/types';

interface ProviderServicesProps {
    services: service[];
}

const SERVICES_PER_PAGE = 4;

const ProviderServices: React.FC<ProviderServicesProps> = ({
    services = []
}) => {
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
                            <div className="p-4 flex-row">
                                <h3 className="font-bold text-gray-800 mb-1">{service.title}</h3>
                                {service.description && (
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-2">{service.description}</p>
                                )}
                                {service.price && (
                                    <div className="font-medium text-gray-900">
                                        ${service.price}
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-start gap-2 items-center p-4 border-t border-gray-200'>
                                {service.serviceTag && (
                                    <div className="mt-2">
                                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                            {service.serviceTag}
                                        </span>
                                    </div>
                                )}
                                {service.serviceTag2 && (
                                    <div className="mt-2">
                                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                            {service.serviceTag2}
                                        </span>
                                    </div>
                                )}
                                {service.serviceTag3 && (
                                    <div className="mt-2">
                                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                            {service.serviceTag3}
                                        </span>
                                    </div>
                                )}
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
        </div>
    );
};

export default ProviderServices;