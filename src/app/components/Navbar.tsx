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
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const name = sessionStorage.getItem('userName');
    const userRole = sessionStorage.getItem('role');
    if (name && userRole) {
      setIsLoggedIn(true);
      setRole(userRole);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
    router.push('/');
  };

  const getRoleLabel = () => (role === '1' ? 'Admin' : 'Judge');

  return (
    <header className="bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center relative">
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

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden focus:outline-none z-50"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Links */}
        <nav
          className={`absolute md:static top-16 right-4 md:top-0 md:right-0 bg-violet-200 md:bg-transparent text-black md:text-white rounded-xl md:rounded-none shadow-lg md:shadow-none flex flex-col md:flex-row gap-4 md:gap-8 p-6 md:p-0 transition-all duration-300 ${
            menuOpen ? 'block' : 'hidden md:flex'
          }`}
        >
          {!isLoggedIn ? (
            <>
              <Link
                href="/signup"
                className="bg-white text-violet-700 px-4 py-2 rounded-lg hover:bg-pink-100 transition"
              >
                Sign-Up
              </Link>
              <Link
                href="/login"
                className="bg-white text-pink-600 px-4 py-2 rounded-lg hover:bg-violet-100 transition"
              >
                Sign-In
              </Link>
            </>
          ) : (
            <>
              {/* Profile Info */}
              <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-md">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
                  {userName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {userName}
                  </span>
                  <span className="text-xs font-medium text-violet-600 bg-violet-100 px-2 py-0.5 rounded-full w-fit">
                    {getRoleLabel()}
                  </span>
                </div>
              </div>

              {/* Dashboard and Other Links */}
              <Link
                href={role === '1' ? '/admin/dashboard' : '/judge/dashboard'}
                className="bg-white text-violet-700 px-4 py-2 rounded-lg hover:bg-pink-100 transition text-center"
              >
                Dashboard
              </Link>

              {/* {role === '1' && (
                // <>
                //   <Link
                //     href="/admin/leaderboard"
                //     className="bg-white text-violet-700 px-4 py-2 rounded-lg hover:bg-pink-100 transition text-center"
                //   >
                //     LeaderBoard
                //   </Link>
                //   <Link
                //     href="/admin/domain-leaderboard"
                //     className="bg-white text-violet-700 px-4 py-2 rounded-lg hover:bg-pink-100 transition text-center"
                //   >
                //     Domain LeaderBoard
                //   </Link>
                // </>
              )} */}

              <button
                onClick={handleLogout}
                className="bg-white text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition text-center"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
