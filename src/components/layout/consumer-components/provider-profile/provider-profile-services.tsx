import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { service } from '@/types';
import { serialize } from 'v8';


interface ProviderServicesProps {
    services: service[];
}

const ProviderServices: React.FC<ProviderServicesProps> = ({
    services = []
}) => {
    const [sortBy, setSortBy] = useState('popular');

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Servicios ofrecidos</h2>

                <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Ordenar por:</span>
                    <select
                        className="border-gray-300 rounded-md text-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="popular">Popular</option>
                        <option value="price_low">Precio: Menor a mayor</option>
                        <option value="price_high">Precio: Mayor a menor</option>
                        <option value="newest">Más recientes</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
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

                                {
                                    service.serviceTag && (
                                        <div className="mt-2">
                                            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                                {service.serviceTag}
                                            </span>
                                        </div>
                                    )
                                }
                                {
                                    service.serviceTag2 && (
                                        <div className="mt-2">
                                            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                                {service.serviceTag}
                                            </span>
                                        </div>
                                    )
                                }
                                {
                                    service.serviceTag3 && (
                                        <div className="mt-2">
                                            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
                                                {service.serviceTag}
                                            </span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProviderServices;