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
      {/* Top bar with Cart - always black background */}
      <div className={`${scrollable ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-[100] bg-black`}>
        <div className="flex justify-between items-center px-4 md:px-8 py-2">
          {/* Mobile menu button */}
          <button
            className="md:hidden text-white hover:opacity-70 transition-opacity"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Spacer for desktop */}
          <div className="hidden md:block" />

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-1 md:gap-2 text-white hover:opacity-70 transition-opacity"
          >
            <ShoppingCart size={20} strokeWidth={1} />
            <span className="text-sm md:text-base font-light tracking-wide">{totalItems}</span>
          </Link>
        </div>
      </div>

      {/* Main header with title and nav - overlaid on content */}
      <header className={`${scrollable ? 'absolute' : 'fixed'} top-[44px] left-0 right-0 z-[90] px-4 md:px-6 pt-2 md:pt-3 pb-2 md:pb-3 ${!isDark ? 'bg-white' : ''}`}>
        <div className="w-full">
          {/* Title - Responsive sizing */}
          <h1 className="text-center mb-1 md:mb-2">
            <Link
              href="/"
              className={`${isDark ? 'text-black' : 'text-[#3d3d3d]'} text-[18px] sm:text-[24px] md:text-[32px] lg:text-[42px] font-extralight tracking-[0.15em] md:tracking-[0.3em] uppercase hover:opacity-80 transition-opacity`}
              style={{ fontFamily: "Avenir, 'Avenir Next', Montserrat, 'Century Gothic', 'Helvetica Neue', Arial, sans-serif", fontWeight: 200 }}
            >
              UNITED STUDIO COLLECTIVE
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-center items-center flex-wrap">
            {navItems.map((item) => {
              const isActive = currentPage ? item.name === currentPage : pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[14px] lg:text-[18px] font-normal tracking-wide hover:opacity-60 transition-opacity px-4 lg:px-10 py-2 ${
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
          </nav>
        </div>
      )}
    </>
  );
}
