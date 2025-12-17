"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const images = [
  { src: `${basePath}/image_4.jpg`, alt: "Sand dunes with person", link: "/filmmaking" },
  { src: `${basePath}/image_3.jpg`, alt: "Blurry subway/train", link: "/photography" },
  { src: `${basePath}/image_5.jpg`, alt: "Band in bar", link: "/store" },
  { src: `${basePath}/image_2.jpg`, alt: "B&W two people window", link: "/about" },
  { src: `${basePath}/image_1.jpg`, alt: "B&W single person window", link: "/contact" },
];

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
