'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import LogoutButton from '@/components/logoutButton';

interface ConsumerHeaderProps {
    userName?: string;
}

const ConsumerHeader: React.FC<ConsumerHeaderProps> = ({ }) => {
    const { data: session } = useSession();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link className='flex gap-2' href="/services">
                            <Image
                                src="https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png"
                                alt="Maestro Chasquilla"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <h1 className=" text-xl font-bold text-gray-800">
                                RED <span className="text-orange-500">MAESTRO</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:block md:space-x-8">
                        <Link href="/services" className=" text-gray-500 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                            Home
                        </Link>
                        <Link href="/consumer/categories" className=" text-gray-500 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                            Categorias
                        </Link>
                        <Link href="/consumer/about" className=" text-gray-500 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                            Información
                        </Link>
                        <Link href="/consumer/contact" className=" text-gray-500 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                            Contacto
                        </Link>
                    </nav>

                    <div className="flex items-center">

                        {/* <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                            <span className="sr-only">View notifications</span>
                 
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                                />
                            </svg>
                        </button> */}
                        {session?.user ? (
                            <div className="ml-4 relative flex items-center">
                                <div className="relative mx-4">
                                    <Link href="/services/consumer-profile" className="flex items-center space-x-2 p-2 rounded-full text-gray-500 hover:bg-orange-100 hover:text-gray-700">
                                        <div
                                            className="w-10 h-10 aspect-square rounded-full overflow-hidden flex items-center justify-center"
                                            style={{ minWidth: 40, minHeight: 40, maxWidth: 40, maxHeight: 40, aspectRatio: "1 / 1" }}
                                        >
                                            <Image
                                                src={session?.user?.image || "https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png"}
                                                alt="User Avatar"
                                                width={40}
                                                height={40}
                                                className="object-cover w-full h-full"
                                                style={{ borderRadius: "9999px" }}
                                            />
                                        </div>
                                        {session?.user?.name && (
                                            <span className="hidden md:block text-sm font-medium">{session.user.name}</span>
                                        )}
                                    </Link>
                                </div>
                                <LogoutButton />
                            </div>
                        ) :
                            <Link href="/login" className="bg-white text-orange-500 border border-orange-500 hover:text-white hover:bg-orange-500 hover:border-transparent px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                Iniciar Sesión
                            </Link>
                        }
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ConsumerHeader;