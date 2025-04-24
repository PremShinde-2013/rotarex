"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //     const email = sessionStorage.getItem('userEmail');
  //     setIsLoggedIn(!!email);
  // }, []);

  useEffect(() => {
    const checkLogin = () => {
      const email = sessionStorage.getItem("userEmail");
      setIsLoggedIn(!!email);
    };

    checkLogin(); // initial check

    // listen for changes (e.g., login/logout from another tab)
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.success("Logged out successfully");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <>
      <Toaster position="top-right" />
      <header className="bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/logo_w.png"
              alt="Site Logo"
              width={180}
              height={100}
              className="max-h-12 object-contain transition-transform group-hover:scale-105"
              priority
            />
          </Link>

          <nav className="flex items-center space-x-3 sm:space-x-5 text-sm sm:text-base font-medium">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="relative inline-flex items-center justify-center px-6 py-2 rounded-md bg-white text-pink-600 font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-pink-50 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="relative inline-flex items-center justify-center px-6 py-2 rounded-full bg-white text-violet-700 font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-violet-50 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="relative inline-flex items-center justify-center px-6 py-2 rounded-full bg-white text-pink-600 font-semibold shadow-md transition-all duration-300 ease-in-out hover:bg-pink-50 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                >
                  Sign In
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
