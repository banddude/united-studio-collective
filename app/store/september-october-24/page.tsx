"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const products = [
  {
    id: 1,
    name: "An Evening With A Cherry Blossom Tree",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_7d3c9ccd3b27414eb6485414f9e186dc~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_7d3c9ccd3b27414eb6485414f9e186dc~mv2.jpg",
  },
  {
    id: 2,
    name: "The Ocean As Seen By Portra",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_908459ee9e1146b89c711c9b8498f44b~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_908459ee9e1146b89c711c9b8498f44b~mv2.jpg",
  },
  {
    id: 3,
    name: "Sunsets In The City",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_0549c7a359d44ebd8c3a88462a9c5b76~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_0549c7a359d44ebd8c3a88462a9c5b76~mv2.jpg",
  },
  {
    id: 4,
    name: "Glass Verticality",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_465ea9bdeb424542b3d8fb4d7c271b3d~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_465ea9bdeb424542b3d8fb4d7c271b3d~mv2.jpg",
  },
  {
    id: 5,
    name: "Passing In The Night",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_4bb4be2d33604c97964b78ae9505a311~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_4bb4be2d33604c97964b78ae9505a311~mv2.jpg",
  },
  {
    id: 6,
    name: "Endless Movement",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_1686cc4a6d3d418290051f9816509d9b~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_1686cc4a6d3d418290051f9816509d9b~mv2.jpg",
  },
  {
    id: 7,
    name: "The Beacon Of Los Feliz",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_2bcbe6c57e684d578daebd843560ad51~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_2bcbe6c57e684d578daebd843560ad51~mv2.jpg",
  },
  {
    id: 8,
    name: "Colored Streaks",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_44bf21a091f84cd8a349ed22767901ec~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_44bf21a091f84cd8a349ed22767901ec~mv2.jpg",
  },
  {
    id: 9,
    name: "Night At The Opera",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_650f99281b1b4346b8626471dd20cc68~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_650f99281b1b4346b8626471dd20cc68~mv2.jpg",
  },
  {
    id: 10,
    name: "Jefferson",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_509815faf01144a58c8193ff429e3740~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_509815faf01144a58c8193ff429e3740~mv2.jpg",
  },
];

export default function SeptemberOctoberCatalogPage() {
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
            <span className="text-gray-900">September - October &apos;24 Catalog</span>
          </nav>
        </div>

        {/* Page Title and Description */}
        <div className="px-4 md:px-6 mb-6">
          <h1 className="text-xl md:text-2xl font-medium text-black mb-2">September - October &apos;24 Catalog</h1>
          <p className="text-sm text-gray-600">
            Prints available for purchase during September - October Catalog. Stay tuned for bi-monthly catalog updates!
          </p>
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
                  href="/store/september-october-24"
                  className="block text-sm hover:text-gray-300 transition-colors text-white"
                >
                  September - October &apos;24 Catalog
                </Link>
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
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
