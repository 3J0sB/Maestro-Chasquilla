'use client';
import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import LogoutButton from '@/components/logoutButton';

interface ConsumerHeaderProps {
    userName?: string;
}

const ConsumerHeader: React.FC<ConsumerHeaderProps> = ({ userName }) => {
    const { data: session } = useSession();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link className='flex gap-2' href="/services">
                            <Image
                                src="/img/miau.jpg"
                                alt="Maestro Chasquilla"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                            <h1 className="text-xl font-bold text-gray-800">
                                Maestro <span className="text-orange-500">Chasquilla</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:ml-6 md:flex md:space-x-8">
                        <Link href="/services" className="text-gray-500 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                            Home
                        </Link>
                        <Link href="/consumer/categories" className="text-gray-500 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                            Categorias
                        </Link>
                        <Link href="/consumer/about" className="text-gray-500 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                            Información
                        </Link>
                        <Link href="/consumer/contact" className="text-gray-500 hover:text-orange-500 px-3 py-2 text-sm font-medium">
                            Contacto
                        </Link>
                    </nav>

                    {/* Right icons */}
                    <div className="flex items-center">
                        {/* Notifications */}
                        <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                            <span className="sr-only">View notifications</span>
                            {/* Bell SVG icon */}
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
                        </button>

                        {/* User menu */}
                        <div className="ml-4 relative flex items-center">
                            <div className="relative mx-4">
                                <Link href="/services/consumer-profile" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                                    {/* User SVG icon */}
                                    <div className="h-8 w-8 p-1 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                            />
                                        </svg>
                                    </div>
                                    {session?.user?.name && (
                                        <span className="hidden md:block text-sm font-medium">{session.user.name}</span>
                                    )}
                                </Link>
                            </div>
                            <LogoutButton />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden border-t border-gray-200 py-2">
                <div className="space-y-1 px-4">
                    <Link href="/consumer/home" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-orange-500">
                        Home
                    </Link>
                    <Link href="/consumer/categories" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-orange-500">
                        Categories
                    </Link>
                    <Link href="/consumer/about" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-orange-500">
                        About
                    </Link>
                    <Link href="/consumer/contact" className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-orange-500">
                        Contact
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default ConsumerHeader;