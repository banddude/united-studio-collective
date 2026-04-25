import Link from "next/link";
import Image from "next/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServicesBanner from "../../components/ServicesBanner";
import {
  getArchivedProducts,
  artistToSlug,
  getThumbPath,
  getArchivedNotice,
} from "../../lib/store-data";

export const metadata = {
  title: "Archive | United Studio Collective",
  description:
    "Past catalog photographs from artists previously featured by United Studio Collective. Reach out directly if you'd like to purchase a piece from the archive.",
};

export default function ArchivePage() {
  const products = getArchivedProducts();
  const notice = getArchivedNotice();

  // Group archived products by artist for clearer browsing.
  const grouped = new Map<string, typeof products>();
  products.forEach((p) => {
    const key = p.artist || "Unknown";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(p);
  });

  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="Store" />

      <div className="pt-[120px] md:pt-[150px] pb-16 px-4 md:px-6 max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <Link href="/store" className="hover:text-gray-900">
            Store
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900">Archive</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-4xl font-light text-black mb-3">
            Archive
          </h1>
          <p className="text-gray-600 max-w-2xl">{notice}</p>
          <p className="mt-3">
            <Link
              href="/contact"
              className="inline-block text-sm underline underline-offset-4 text-black hover:text-gray-700"
            >
              Contact United Studio Collective
            </Link>
          </p>
        </header>

        {/* Empty state */}
        {products.length === 0 && (
          <p className="text-gray-500">There are no archived prints right now.</p>
        )}

        {/* Grouped by artist */}
        {Array.from(grouped.entries()).map(([artist, items]) => (
          <section key={artist} className="mb-12">
            <div className="flex items-baseline justify-between mb-4 border-b border-gray-200 pb-2">
              <h2 className="text-lg md:text-xl font-light text-black">
                {artist}
              </h2>
              <Link
                href={`/store/artist/${artistToSlug(artist)}`}
                className="text-xs text-gray-500 hover:text-black underline underline-offset-2"
              >
                View Artist Page
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {items.map((product) => (
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
                      className="object-cover transition-transform duration-200 group-hover:scale-105 grayscale-[15%] group-hover:grayscale-0"
                      unoptimized
                    />
                  </div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    {product.name}
                  </h3>
                  <div className="text-xs text-gray-500 italic">Archived</div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <ServicesBanner />

      <Footer />
    </div>
  );
}
