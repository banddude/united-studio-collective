"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useCart } from "../../../context/CartContext";
import { X, ChevronLeft, ChevronRight, Minus, Plus, Check } from "lucide-react";
import type { Product } from "../../../lib/store-data";

const baseUrl = "https://unitedstudiocollective.com";
const frameOptions = ["Frameless Photograph", "Framed Photograph"];
const frameColors = ["Black", "White"];
const FRAME_PRICE_ADDITION = 25;

interface ProductClientProps {
  product: Product;
  prevProduct: Product | null;
  nextProduct: Product | null;
  artist: string;
  size: string;
  description: string;
  stripeEnabled: boolean;
}

export default function ProductClient({
  product,
  prevProduct,
  nextProduct,
  artist,
  size,
  description,
  stripeEnabled,
}: ProductClientProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [frameOption, setFrameOption] = useState("");
  const [frameColor, setFrameColor] = useState("");
  const [showAdded, setShowAdded] = useState(false);
  const [error, setError] = useState("");

  const isFrameless = frameOption === "Frameless Photograph";
  const currentPrice = frameOption === "Framed Photograph" ? product.price + FRAME_PRICE_ADDITION : product.price;

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const validateSelection = () => {
    if (!frameOption) {
      setError("Please select a frame option");
      return false;
    }
    if (!isFrameless && !frameColor) {
      setError("Please select a frame color");
      return false;
    }
    setError("");
    return true;
  };

  const handleAddToCart = () => {
    if (!validateSelection()) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      frameOption,
      frameColor: isFrameless ? null : frameColor,
      quantity,
    });

    setShowAdded(true);
    setTimeout(() => setShowAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!validateSelection()) return;

    // Check if Stripe is enabled and we have a payment link
    if (stripeEnabled) {
      let stripeLink = "";
      if (isFrameless) {
        stripeLink = product.stripe.frameless;
      } else if (frameColor === "Black") {
        stripeLink = product.stripe.framed_black;
      } else if (frameColor === "White") {
        stripeLink = product.stripe.framed_white;
      }

      if (stripeLink) {
        window.location.href = stripeLink;
        return;
      }
    }

    // Fallback to cart
    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      image: product.image,
      frameOption,
      frameColor: isFrameless ? null : frameColor,
      quantity,
    });

    router.push("/cart");
  };

  // Product schema for SEO
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: description,
    image: product.image,
    brand: {
      "@type": "Brand",
      name: "United Studio Collective",
    },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/store/product/${product.id}`,
      priceCurrency: "USD",
      price: currentPrice.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "United Studio Collective",
      },
    },
    category: "Fine Art Photography",
    material: "Premium Photography Print",
  };

  // Breadcrumb schema for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Store",
        item: `${baseUrl}/store`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `${baseUrl}/store/product/${product.id}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header variant="light" currentPage="Store" />

      <main className="pt-[120px] md:pt-[170px] pb-16">

        {/* Breadcrumb and Navigation */}
        <div className="px-4 md:px-6 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <nav className="flex items-center text-xs md:text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-1 md:mx-2">/</span>
            <Link href="/store" className="hover:text-gray-900">
              All Products
            </Link>
            <span className="mx-1 md:mx-2">/</span>
            <span className="text-gray-900 truncate max-w-[150px] md:max-w-none">{product.name}</span>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {prevProduct ? (
              <Link
                href={`/store/product/${prevProduct.id}`}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft size={16} />
                Prev
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-400">
                <ChevronLeft size={16} />
                Prev
              </span>
            )}
            <span className="text-gray-400">|</span>
            {nextProduct ? (
              <Link
                href={`/store/product/${nextProduct.id}`}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                Next
                <ChevronRight size={16} />
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-gray-400">
                Next
                <ChevronRight size={16} />
              </span>
            )}
            {/* Close button */}
            <Link
              href="/store"
              className="ml-2 w-6 h-6 bg-black rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <X size={12} className="text-white" />
            </Link>
          </div>
        </div>

        {/* Product Content */}
        <div className="px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            {/* Left: Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
              </div>
              {/* Product Info below image */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>Image Size: {size}</p>
                <p>Artist: {artist}</p>
                <p className="mt-4">{description}</p>
              </div>
            </div>

            {/* Right: Product Details */}
            <div>
              <h1 className="text-3xl font-medium text-black mb-4">{product.name}</h1>
              <p className="text-2xl text-black mb-6">${currentPrice.toFixed(2)}</p>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded">
                  {error}
                </div>
              )}

              {/* Frame Option */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Frame Option *
                </label>
                <select
                  value={frameOption}
                  onChange={(e) => {
                    setFrameOption(e.target.value);
                    if (e.target.value === "Frameless Photograph") {
                      setFrameColor("");
                    }
                    setError("");
                  }}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">Select</option>
                  {frameOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color of Frame */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${isFrameless ? "text-gray-400" : "text-black"}`}>
                  Color of Frame {!isFrameless && "*"}
                </label>
                <select
                  value={frameColor}
                  onChange={(e) => {
                    setFrameColor(e.target.value);
                    setError("");
                  }}
                  disabled={isFrameless}
                  className={`w-full border rounded px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black ${
                    isFrameless
                      ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 bg-white text-black"
                  }`}
                >
                  <option value="">{isFrameless ? "N/A" : "Select"}</option>
                  {!isFrameless && frameColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-black mb-2">
                  Quantity *
                </label>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 bg-black text-white flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 h-10 flex items-center justify-center border-t border-b border-gray-300 text-sm text-black bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-gray-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors mb-3 flex items-center justify-center gap-2"
              >
                {showAdded ? (
                  <>
                    <Check size={18} />
                    Added to Cart
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="w-full bg-gray-100 text-black py-4 text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
