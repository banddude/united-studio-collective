import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getProducts, getDisplayArtists, artistToSlug, getProductsByArtist, getFeaturedArtist } from "../lib/store-data";

export default function StorePage() {
  const products = getProducts();
  const artists = getDisplayArtists();
  const featuredArtist = getFeaturedArtist();
  const featuredProducts = getProductsByArtist(featuredArtist.name).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header variant="light" currentPage="Store" />

      {/* Main Content */}
      <div className="pt-[120px] md:pt-[150px] pb-16">
        {/* Featured Artist Section */}
        <section className="px-4 md:px-6 mb-12">
          <div className="bg-gray-50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
              {/* Artist Photo */}
              <div className="w-32 md:w-40 flex-shrink-0">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={featuredArtist.image}
                    alt={featuredArtist.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Artist Info */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-sm uppercase tracking-wider text-gray-500 mb-1">{featuredArtist.tagline}</p>
                <h2 className="text-2xl md:text-3xl font-light text-black mb-3">{featuredArtist.name}</h2>
                <p className="text-gray-600 mb-4 max-w-xl">{featuredArtist.description}</p>
                <Link
                  href={`/store/artist/${artistToSlug(featuredArtist.name)}`}
                  className="inline-block bg-black text-white px-5 py-2 text-sm hover:bg-gray-800 transition-colors"
                >
                  View Collection
                </Link>
              </div>

              {/* Preview Products */}
              <div className="hidden lg:grid grid-cols-2 gap-3 w-64 flex-shrink-0">
                {featuredProducts.map((product) => (
                  <Link key={product.id} href={`/store/product/${product.id}`} className="group">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

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
          <aside className="hidden md:block w-48 flex-shrink-0 mr-8">
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
                  href="/store/winter-spring-26"
                  className="block text-sm hover:text-gray-300 transition-colors text-gray-300"
                >
                  Winter Spring '26
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
