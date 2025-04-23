'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode; }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const email = sessionStorage.getItem('userEmail');
        setIsLoggedIn(!!email);
    }, []);

    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('Logged out successfully');
        setIsLoggedIn(false);
        router.push('/');
    };

    return (
        <>
            <Toaster position="top-right" />
            <header className="bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md sticky top-0 z-50 p-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/logo_w.png"
                            alt="Site Logo"
                            width={250}
                            height={150}
                            className="object-contain"
                        />
                    </Link>

                    <nav className="space-x-4 md:space-x-6 flex items-center text-sm md:text-base font-medium">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-white text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition duration-200 shadow-sm"
                            >
                                LOGOUT
                            </button>
                        ) : (
                            <>
                                <Link
                                    href="/signup"
                                    className="bg-white text-violet-700 px-4 py-2 rounded-full hover:bg-pink-100 transition duration-200 shadow-sm"
                                >
                                    SIGN-UP
                                </Link>
                                <Link
                                    href="/login"
                                    className="bg-white text-pink-600 px-4 py-2 rounded-full hover:bg-violet-100 transition duration-200 shadow-sm"
                                >
                                    SIGN-IN
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main>{children}</main>
        </>
    );
}
