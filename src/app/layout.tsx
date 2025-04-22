import "./globals.css";
import { ReactNode } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ideas Meet Actions",
  description: "Major & Mini Project Competition Registration",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-violet-50 to-pink-50 text-gray-800`}
      >
        <header className="bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-md sticky top-0 z-50 p-4">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo_w.png"
                alt="Site Logo"
                width={250}
                height={150}
                className="object-contain"
              />
            </Link>

            {/* Navigation */}
            <nav className="space-x-4 md:space-x-6 flex items-center text-sm md:text-base font-medium">
              <a
                href="/admin/dashboard"
                className="bg-white text-violet-700 px-4 py-2 rounded-full hover:bg-pink-100 transition duration-200 shadow-sm"
              >
                SIGN-UP
              </a>
              <a
                href="/judge/dashboard"
                className="bg-white text-pink-600 px-4 py-2 rounded-full hover:bg-violet-100 transition duration-200 shadow-sm"
              >
                SIGN-IN
              </a>
            </nav>
          </div>
        </header>

        <main className="">{children}</main>
      </body>
    </html>
  );
}
