"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { getDisplayArtists, artistToSlug, getThumbPath } from "../../lib/store-data";

const products = [
  {
    id: 1,
    name: "An Evening With A Cherry Blossom Tree",
    price: 85.0,
    image: "/images/store/963954_7d3c9ccd3b27414eb6485414f9e186dc~mv2.jpg",
  },
  {
    id: 2,
    name: "The Ocean As Seen By Portra",
    price: 85.0,
    image: "/images/store/963954_908459ee9e1146b89c711c9b8498f44b~mv2.jpg",
  },
  {
    id: 3,
    name: "Sunsets In The City",
    price: 85.0,
    image: "/images/store/963954_0549c7a359d44ebd8c3a88462a9c5b76~mv2.jpg",
  },
  {
    id: 4,
    name: "Glass Verticality",
    price: 85.0,
    image: "/images/store/963954_465ea9bdeb424542b3d8fb4d7c271b3d~mv2.jpg",
  },
  {
    id: 5,
    name: "Passing In The Night",
    price: 85.0,
    image: "/images/store/963954_4bb4be2d33604c97964b78ae9505a311~mv2.jpg",
  },
  {
    id: 6,
    name: "Endless Movement",
    price: 85.0,
    image: "/images/store/963954_1686cc4a6d3d418290051f9816509d9b~mv2.jpg",
  },
  {
    id: 7,
    name: "The Beacon Of Los Feliz",
    price: 85.0,
    image: "/images/photography/963954_2bcbe6c57e684d578daebd843560ad51~mv2.jpg",
  },
  {
    id: 8,
    name: "Colored Streaks",
    price: 85.0,
    image: "/images/store/963954_44bf21a091f84cd8a349ed22767901ec~mv2.jpg",
  },
  {
    id: 9,
    name: "Night At The Opera",
    price: 85.0,
    image: "/images/store/963954_650f99281b1b4346b8626471dd20cc68~mv2.jpg",
  },
  {
    id: 10,
    name: "Jefferson",
    price: 85.0,
    image: "/images/store/963954_509815faf01144a58c8193ff429e3740~mv2.jpg",
  },
];

export default function WinterSpringCatalogPage() {
  const artists = getDisplayArtists();

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
            <span className="text-gray-900">Winter Spring &apos;26 Catalog</span>
          </nav>
        </div>

        {/* Page Title and Description */}
        <div className="px-4 md:px-6 mb-6">
          <h1 className="text-xl md:text-2xl font-medium text-black mb-2">Winter Spring &apos;26 Catalog</h1>
          <p className="text-sm text-gray-600">
            Prints available for purchase during Winter Spring Catalog. Stay tuned for seasonal catalog updates!
          </p>
        </div>

        {/* Mobile Browse Menu */}
        <div className="md:hidden px-4 mb-6">
          <details className="bg-black text-white rounded-lg overflow-hidden">
            <summary className="px-4 py-3 text-sm font-medium cursor-pointer flex items-center justify-between">
              <span>Browse</span>
              <svg className="w-4 h-4 transition-transform details-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 border-t border-gray-700">
              <nav className="pt-3 space-y-2">
                <Link href="/store" className="block text-sm text-gray-300 py-1">All Products</Link>
                <Link href="/store/winter-spring-26" className="block text-sm text-white py-1">Winter Spring &apos;26</Link>
              </nav>
              <h3 className="text-xs uppercase tracking-wider text-gray-400 mt-4 mb-2">Artists</h3>
              <nav className="space-y-2">
                {artists.map((artist) => (
                  <Link
                    key={artist}
                    href={`/store/artist/${artistToSlug(artist)}`}
                    className="block text-sm text-gray-300 py-1"
                  >
                    {artist}
                  </Link>
                ))}
              </nav>
            </div>
          </details>
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
                  className="block text-sm hover:text-gray-300 transition-colors text-gray-300"
                >
                  All Products
                </Link>
                <Link
                  href="/store/winter-spring-26"
                  className="block text-sm hover:text-gray-300 transition-colors text-white"
                >
                  Winter Spring &apos;26
                </Link>
              </nav>

              <h2 className="text-sm font-medium mt-6 mb-4 border-b border-gray-600 pb-2">
                Artists
              </h2>
              <nav className="space-y-3">
                {artists.map((artist) => (
                  <Link
                    key={artist}
                    href={`/store/artist/${artistToSlug(artist)}`}
                    className="block text-sm hover:text-gray-300 transition-colors text-gray-300"
                  >
                    {artist}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
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
                      src={getThumbPath(product.image)}
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
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
