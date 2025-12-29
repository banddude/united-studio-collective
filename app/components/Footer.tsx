"use client";

import { Instagram, ChevronUp } from "lucide-react";
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
      {/* Top section with title and nav */}
      <div className="py-12 px-6">
        {/* Title */}
        <h2 className="text-center text-2xl md:text-3xl tracking-[0.3em] font-light mb-10">
          UNITED STUDIO COLLECTIVE
        </h2>

        {/* Navigation */}
        <nav className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg font-light hover:opacity-60 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#e8e8e8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left: Copyright */}
          <div className="text-sm font-light">
            <Link href="/" className="underline hover:opacity-70 transition-opacity">
              © 2026 United Studio Collective
            </Link>
            <div className="text-xs mt-1 opacity-70">© Copyright</div>
          </div>

          {/* Center: Back to Top button */}
          <button
            onClick={scrollToTop}
            className="bg-black text-white px-6 py-2 flex items-center gap-2 text-sm font-light hover:bg-gray-800 transition-colors"
          >
            <span>Back to Top</span>
            <ChevronUp size={16} />
          </button>

          {/* Right: Connect with us */}
          <div className="flex items-center gap-4">
            <Link href="/contact" className="text-sm font-light hover:opacity-70 transition-opacity">Connect with us!</Link>
            <a
              href="https://www.instagram.com/unitedstudiocollective/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              <Instagram size={24} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
