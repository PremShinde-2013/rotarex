'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null); // Change userEmail to userName

    useEffect(() => {
        const name = sessionStorage.getItem('userName'); // Get the name from sessionStorage
        const userRole = sessionStorage.getItem('role');
        if (name && userRole) {
            setIsLoggedIn(true);
            setRole(userRole);
            setUserName(name); // Set the user's name here
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('userName'); // Remove userName from sessionStorage
        sessionStorage.removeItem('role');
        setIsLoggedIn(false);
        router.push('/');
    };

    const getRoleLabel = () => {
        return role === '1' ? 'Admin' : 'Judge';
    };

    return (
        <header className="bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo_w.png"
            alt="Site Logo"
            width={160}
            height={90}
            className="object-contain"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            menuOpen ? 'block' : 'hidden'
          } md:flex md:items-center md:space-x-6 space-y-4 md:space-y-0 mt-4 md:mt-0 text-sm md:text-base font-medium bg-violet-200 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none absolute md:static right-4 top-16 md:top-auto`}
        >
          {!isLoggedIn ? (
            <>
              <Link
                href="/signup"
                className="bg-white text-violet-700 px-4 py-2 rounded-full hover:bg-pink-100 transition duration-200 shadow-sm text-center block"
              >
                SIGN-UP
              </Link>
              <Link
                href="/login"
                className="bg-white text-pink-600 px-4 py-2 rounded-full hover:bg-violet-100 transition duration-200 shadow-sm text-center block"
              >
                SIGN-IN
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="bg-white text-violet-600 font-semibold rounded-full w-10 h-10 p-2 flex items-center justify-center text-xs uppercase shadow-sm">
                  {getRoleLabel()}
                </div>
                <span className="hidden md:inline text-sm text-white font-medium">
                  {userName}
                </span>
              </div>

              <Link
                href={role === '1' ? '/admin/dashboard' : '/judge/dashboard'}
                className="bg-white text-violet-700 px-4 py-2 rounded-full hover:bg-pink-100 transition duration-200 shadow-sm text-center block"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-white text-red-500 px-4 py-2 rounded-full hover:bg-red-100 transition duration-200 shadow-sm text-center block"
              >
                LOGOUT
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
    );
}
