"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import homepageData from "../content/homepage-images.json";

const images = homepageData.gallery_images.map((img) => ({
  src: img.src,
  alt: img.description || img.alt,
  link: img.link || "/"
}));

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Scrollable Header overlaid on top - scrolls away with page */}
      <Header variant="dark" currentPage="Home" scrollable />

      {/* Full-viewport images stacked vertically */}
      <div className="flex flex-col">
        {images.map((image, index) => (
          <Link
            key={image.src}
            href={image.link}
            className="relative w-full block"
            style={{ height: '100vh' }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index < 2}
              className="object-cover"
              sizes="100vw"
              quality={80}
            />
          </Link>
        ))}
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}
