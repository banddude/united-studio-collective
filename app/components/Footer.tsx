"use client";

import { Instagram, ArrowUp } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/filmmaking", label: "Filmmaking" },
  { href: "/photography", label: "Photography" },
  { href: "/store", label: "Store" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#f0f0f0] text-black">
      {/* Main content */}
      <div className="px-6 py-12">
        {/* Title */}
        <h2 className="text-center text-xl md:text-2xl lg:text-3xl tracking-[0.2em] md:tracking-[0.3em] font-light mb-8 md:mb-10">
          UNITED STUDIO COLLECTIVE
        </h2>

        {/* Navigation - stacked on mobile, row on desktop */}
        <nav className="flex flex-row flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-16 mb-8 md:mb-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base md:text-lg font-light hover:opacity-60 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Connect section - centered */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <Link
            href="/contact"
            className="text-sm md:text-base font-light hover:opacity-70 transition-opacity"
          >
            Connect with us
          </Link>
          <span className="hidden sm:inline opacity-50">|</span>
          <a
            href="https://www.instagram.com/unitedstudiocollective/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm md:text-base font-light hover:opacity-70 transition-opacity"
          >
            <Instagram size={18} strokeWidth={1.5} />
            <span>@unitedstudiocollective</span>
          </a>
        </div>

        {/* Copyright and Back to Top - stacked on mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-300">
          <div className="text-xs md:text-sm font-light opacity-70">
            © 2026 United Studio Collective
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs md:text-sm font-light hover:opacity-60 transition-opacity px-4 py-2"
          >
            Back to Top
            <ArrowUp size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </footer>
  );
}
