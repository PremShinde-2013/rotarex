// src/app/layout.tsx (NO "use client" here)
import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import SupabaseProvider from "../../utils/SupabaseProvider"; // we'll create this

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rotarex 2025",
  description: "Major & Mini Project Competition Registration",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-violet-50 to-pink-50 text-gray-800 pb-8 `}
      >
        <SupabaseProvider>
          <Navbar />
          <main>{children}</main>
        </SupabaseProvider>
        <footer>
          <div className="bg-white shadow-lg rounded-lg p-4 text-center mt-8 mx-auto max-w-2xl">
            <p className="text-sm text-gray-600 mb-1">
              &copy; {new Date().getFullYear()} Rotarex 2025. All rights
              reserved.
            </p>
            <p className="text-sm text-gray-600">
              Developed by{" "}
              <span className="font-medium text-violet-600">Aaditya Kolhapure</span>,{" "}
              <span className="font-medium text-violet-600">Rajnanda Devgude</span>,
              and{" "}
              <span className="font-medium text-violet-600">Prem Shinde</span>{" "}
              —{" "}
              <span className="italic text-gray-700">
                Department of Computer Science and Engineering , 2024-2025
              </span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
