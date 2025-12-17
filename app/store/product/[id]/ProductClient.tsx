"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { X, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";

const products = [
  {
    id: 1,
    slug: "an-evening-with-a-cherry-blossom-tree",
    name: "An Evening With A Cherry Blossom Tree",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_7d3c9ccd3b27414eb6485414f9e186dc~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_7d3c9ccd3b27414eb6485414f9e186dc~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 2,
    slug: "the-ocean-as-seen-by-portra",
    name: "The Ocean As Seen By Portra",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_908459ee9e1146b89c711c9b8498f44b~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_908459ee9e1146b89c711c9b8498f44b~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 3,
    slug: "sunsets-in-the-city",
    name: "Sunsets In The City",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_0549c7a359d44ebd8c3a88462a9c5b76~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_0549c7a359d44ebd8c3a88462a9c5b76~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 4,
    slug: "glass-verticality",
    name: "Glass Verticality",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_465ea9bdeb424542b3d8fb4d7c271b3d~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_465ea9bdeb424542b3d8fb4d7c271b3d~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 5,
    slug: "passing-in-the-night",
    name: "Passing In The Night",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_4bb4be2d33604c97964b78ae9505a311~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_4bb4be2d33604c97964b78ae9505a311~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 6,
    slug: "endless-movement",
    name: "Endless Movement",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_1686cc4a6d3d418290051f9816509d9b~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_1686cc4a6d3d418290051f9816509d9b~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 7,
    slug: "the-beacon-of-los-feliz",
    name: "The Beacon Of Los Feliz",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_2bcbe6c57e684d578daebd843560ad51~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_2bcbe6c57e684d578daebd843560ad51~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 8,
    slug: "colored-streaks",
    name: "Colored Streaks",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_44bf21a091f84cd8a349ed22767901ec~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_44bf21a091f84cd8a349ed22767901ec~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 9,
    slug: "night-at-the-opera",
    name: "Night At The Opera",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_650f99281b1b4346b8626471dd20cc68~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_650f99281b1b4346b8626471dd20cc68~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
  {
    id: 10,
    slug: "jefferson",
    name: "Jefferson",
    price: 85.0,
    image:
      "https://static.wixstatic.com/media/963954_509815faf01144a58c8193ff429e3740~mv2.jpg/v1/fill/w_542,h_542,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/963954_509815faf01144a58c8193ff429e3740~mv2.jpg",
    artist: "Evan Rene",
    size: "16x20",
    description:
      "This photograph is printed by Digital Photo Printing & Studio, located in Glendale, CA. Whether you have a wall already full of art, or you are looking to start your collection, this photograph is the perfect addition to any home. It is also an amazing gift. All photographs come signed by the artist!",
  },
];

const frameOptions = ["No Frame", "Standard Frame", "Premium Frame"];
const frameColors = ["Black", "White", "Natural Wood", "Dark Wood"];

interface ProductClientProps {
  productId: number;
}

export default function ProductClient({ productId }: ProductClientProps) {
  const product = products.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const [frameOption, setFrameOption] = useState("");
  const [frameColor, setFrameColor] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header variant="light" currentPage="Store" />
        <main className="pt-40 pb-16 px-6 text-center">
          <h1 className="text-2xl font-medium text-black">Product Not Found</h1>
          <Link href="/store" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Store
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentIndex = products.findIndex((p) => p.id === productId);
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="Store" />

      <main className="pt-[227px] pb-16">

        {/* Breadcrumb and Navigation */}
        <div className="px-6 mb-4 flex items-center justify-between">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/store" className="hover:text-gray-900">
              All Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
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
        <div className="px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
                <p>Image Size: {product.size}</p>
                <p>Artist: {product.artist}</p>
                <p className="mt-4">{product.description}</p>
              </div>
            </div>

            {/* Right: Product Details */}
            <div>
              <h1 className="text-3xl font-medium text-black mb-4">{product.name}</h1>
              <p className="text-2xl text-black mb-6">${product.price.toFixed(2)}</p>

              {/* Frame Option */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Frame Option *
                </label>
                <select
                  value={frameOption}
                  onChange={(e) => setFrameOption(e.target.value)}
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
                <label className="block text-sm font-medium text-black mb-2">
                  Color of Frame *
                </label>
                <select
                  value={frameColor}
                  onChange={(e) => setFrameColor(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-3 text-sm text-black bg-white focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option value="">Select</option>
                  {frameColors.map((color) => (
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
              <button className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors mb-3">
                Add to Cart
              </button>

              {/* Buy Now Button */}
              <button className="w-full bg-gray-100 text-black py-4 text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300">
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
