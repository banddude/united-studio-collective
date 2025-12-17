"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stripe: {
    frameless: string;
    framed_black: string;
    framed_white: string;
  };
}

interface StoreConfig {
  stripeEnabled: boolean;
  products: Product[];
}

export default function StorePage() {
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/config/store.json")
      .then((res) => res.json())
      .then((data) => {
        setStoreConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load store config:", err);
        setLoading(false);
      });
  }, []);

  const products = storeConfig?.products || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header variant="light" currentPage="Store" />

      {/* Main Content */}
      <div className="pt-[100px] md:pt-[130px] pb-16">
        {/* Breadcrumb */}
        <div className="px-6 mb-2">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-900">All Products</span>
          </nav>
        </div>

        {/* Page Title */}
        <div className="px-4 md:px-6 mb-6">
          <h1 className="text-xl md:text-2xl font-medium text-black">All Products</h1>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row px-4 md:px-6">
          {/* Left Sidebar - Hidden on mobile */}
          <aside className="hidden md:block w-44 flex-shrink-0 mr-8">
            <div className="bg-black text-white p-4">
              <h2 className="text-sm font-medium mb-4 border-b border-gray-600 pb-2">
                Browse by
              </h2>
              <nav className="space-y-3">
                <Link
                  href="/store"
                  className="block text-sm hover:text-gray-300 transition-colors text-white"
                >
                  All Products
                </Link>
                <Link
                  href="/store/september-october-24"
                  className="block text-sm hover:text-gray-300 transition-colors text-gray-300"
                >
                  September - October &apos;24 Catalog
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">{products.length} products</p>
                </div>

                {/* Product Grid - Responsive columns */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/store/product/${product.id}`}
                      className="group cursor-pointer block"
                    >
                      <div className="aspect-square mb-3 overflow-hidden bg-gray-100 relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                      <h3 className="text-sm font-medium text-black mb-1">
                        {product.name}
                      </h3>
                      <div className="text-sm text-gray-600">
                        ${product.price.toFixed(2)}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
