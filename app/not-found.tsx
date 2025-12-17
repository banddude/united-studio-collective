"use client";

import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header variant="light" />

      <main className="flex-1 flex items-center justify-center pt-[120px] md:pt-[160px] pb-16 px-4">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-light text-black mb-4">404</h1>
          <h2 className="text-xl md:text-2xl font-medium text-black mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
