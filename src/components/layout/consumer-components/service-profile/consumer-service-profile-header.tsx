import React from "react";
import Image from "next/image";
import Link from "next/link";


interface ProviderInfo {
    providerName: string;
    providerLastName: string;
    providerLastName2: string;
    providerId: string;
    providerRating?: number;
    providerRatingCount?: number;
}

export default function ServiceProfileHeader({ providerId,providerRating, providerRatingCount,providerName, providerLastName, providerLastName2}: ProviderInfo) {
    return (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                {/* SVG Avatar */}
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <Image
                        src="/img/miau.jpg"
                        alt="Foto de perfil"
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        priority
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <Link className="flex items-center gap-2" href={`/services/provider/${providerId}`}>
                            <h2 className="text-xl font-bold text-gray-800">{providerName}</h2>
                            <span className="bg-green-400 w-3 h-3 rounded-full inline-block" title="En línea"></span>
                        </Link>
                    </div>
                    <div className="text-gray-500 text-sm">Panadero</div>
                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                            {/* Ubicación SVG */}
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="#9CA3AF" />
                            </svg>
                            Talca, Chile
                        </span>
                        <span className="flex items-center gap-1">
                            {/* Certificado SVG */}
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                <path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2z" fill="#9CA3AF" />
                            </svg>
                            Verificado
                        </span>
                        <span className="flex items-center gap-1">
                            {/* Disponibilidad SVG */}
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="#9CA3AF" />
                                <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Disponible hoy
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-end mt-4 md:mt-0">
                <div className="flex items-center gap-1">
                    {/* Estrella SVG */}
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#FBBF24" />
                    </svg>
                    <span className="font-semibold text-yellow-500 text-lg">{providerRating}</span>
                    <span className="text-gray-500 text-sm ml-1">({providerRatingCount} opiniones)</span>
                </div>
            </div>
        </div>
    );
}