"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";

interface HeaderProps {
  variant?: "dark" | "light";
  currentPage?: string;
  scrollable?: boolean;
}

export default function Header({ variant = "dark", currentPage, scrollable = false }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Filmmaking", path: "/filmmaking" },
    { name: "Photography", path: "/photography" },
    { name: "Store", path: "/store" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isDark = variant === "dark";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main header with title, nav, and cart */}
      <header className={`${scrollable ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-[100] px-4 md:px-6 pt-3 md:pt-4 pb-2 md:pb-3 ${!isDark ? 'bg-white' : ''}`}>
        <div className="w-full relative">
          {/* Mobile menu button - left side */}
          <button
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 text-[#2d2d2d] hover:opacity-70 transition-opacity"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Title - Responsive sizing */}
          <div className="text-center mb-1 md:mb-2">
            <Link
              href="/"
              className={`${isDark ? 'text-black' : 'text-[#3d3d3d]'} text-[18px] sm:text-[24px] md:text-[32px] lg:text-[42px] font-extralight tracking-[0.15em] md:tracking-[0.3em] uppercase hover:opacity-80 transition-opacity`}
              style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif", fontWeight: 200 }}
            >
              UNITED STUDIO COLLECTIVE
            </Link>
          </div>

          {/* Desktop Navigation - matches title width */}
          <div className="hidden md:flex justify-center">
            <nav className="flex justify-between items-center flex-nowrap w-full max-w-[500px] lg:max-w-[800px]">
              {navItems.map((item) => {
                const isActive = currentPage ? item.name === currentPage : pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`text-[11px] sm:text-[12px] md:text-[14px] lg:text-[18px] font-normal tracking-wide hover:opacity-60 transition-opacity py-2 whitespace-nowrap ${
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
              {/* Cart in nav */}
              <Link
                href="/cart"
                className="text-[11px] sm:text-[12px] md:text-[14px] lg:text-[18px] font-normal tracking-wide hover:opacity-60 transition-opacity py-2 text-[#2d2d2d] flex items-center gap-1 whitespace-nowrap"
                style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif" }}
              >
                <ShoppingCart className="w-4 h-4 lg:w-[18px] lg:h-[18px]" strokeWidth={1.5} />
                {totalItems > 0 && <span>({totalItems})</span>}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[95] bg-black/95 md:hidden"
          onClick={closeMobileMenu}
        >
          <nav className="flex flex-col items-center justify-center h-full gap-6">
            {navItems.map((item) => {
              const isActive = currentPage ? item.name === currentPage : pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={closeMobileMenu}
                  className={`text-2xl font-light tracking-wider transition-opacity ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                  style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif" }}
                >
                  {item.name}
                </Link>
              );
            })}
            {/* Cart in mobile menu */}
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="text-2xl font-light tracking-wider transition-opacity text-gray-400 hover:text-white flex items-center gap-3"
              style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif" }}
            >
              <ShoppingCart size={24} strokeWidth={1.5} />
              Cart{totalItems > 0 && ` (${totalItems})`}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
