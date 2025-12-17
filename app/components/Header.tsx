"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User } from "lucide-react";

interface HeaderProps {
  variant?: "dark" | "light";
  currentPage?: string;
  scrollable?: boolean;
}

export default function Header({ variant = "dark", currentPage, scrollable = false }: HeaderProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Filmmaking", path: "/filmmaking" },
    { name: "Photography", path: "/photography" },
    { name: "Store", path: "/store" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isDark = variant === "dark";

  return (
    <>
      {/* Top bar with Login and Cart - always black background */}
      <div className={`${scrollable ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-[100] bg-black`}>
        <div className="flex justify-end items-center gap-8 px-8 py-3">
          <button className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity">
            <User size={22} strokeWidth={1} />
            <span className="text-base font-light tracking-wide">Log In</span>
          </button>
          <button className="flex items-center gap-2 text-white hover:opacity-70 transition-opacity">
            <ShoppingCart size={22} strokeWidth={1} />
            <span className="text-base font-light tracking-wide">0</span>
          </button>
        </div>
      </div>

      {/* Main header with title and nav - overlaid on content */}
      <header className={`${scrollable ? 'absolute' : 'fixed'} top-[52px] left-0 right-0 z-[90] px-6 pt-6 pb-4 ${!isDark ? 'bg-white' : ''}`}>
        <div className="w-full">
          {/* Title - Large, thin, elegant font with wide letter spacing */}
          <h1 className="text-center mb-4">
            <Link
              href="/"
              className="text-[#3d3d3d] text-[32px] md:text-[42px] lg:text-[50px] font-extralight tracking-[0.3em] uppercase hover:opacity-80 transition-opacity"
              style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif", fontWeight: 200 }}
            >
              UNITED STUDIO COLLECTIVE
            </Link>
          </h1>

          {/* Navigation - Clean sans-serif, widely spaced */}
          <nav className="flex justify-center items-center flex-wrap">
            {navItems.map((item) => {
              const isActive = currentPage ? item.name === currentPage : pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[16px] md:text-[18px] font-normal tracking-wide hover:opacity-60 transition-opacity px-6 md:px-10 py-2 ${
                    isActive
                      ? (isDark ? "text-white" : "text-[#8b9bb4] underline underline-offset-4")
                      : "text-[#2d2d2d]"
                  }`}
                  style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}
