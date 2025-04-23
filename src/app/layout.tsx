// src/app/layout.tsx (NO "use client" here)
import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import SupabaseProvider from "../../utils/SupabaseProvider"; // we'll create this

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ideas Meet Actions",
  description: "Major & Mini Project Competition Registration",
};

export default function RootLayout({ children }: { children: ReactNode; }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-br from-violet-50 to-pink-50 text-gray-800`}>
        <SupabaseProvider>
          <Navbar />
          <main>{children}</main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
