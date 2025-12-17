"use client";

import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const images = [
  `${basePath}/image_4.jpg`, // Sand dunes with person
  `${basePath}/image_3.jpg`, // Blurry subway/train
  `${basePath}/image_5.jpg`, // Band in bar
  `${basePath}/image_2.jpg`, // B&W two people window
  `${basePath}/image_1.jpg`, // B&W single person window
];

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Scrollable Header overlaid on top - scrolls away with page */}
      <Header variant="dark" currentPage="Home" scrollable />

      {/* Full-viewport images stacked vertically */}
      <div className="flex flex-col">
        {images.map((image, index) => (
          <section
            key={image}
            className="relative w-full"
            style={{ height: '100vh' }}
          >
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              fill
              priority={index < 2}
              className="object-cover"
              sizes="100vw"
              quality={100}
            />
          </section>
        ))}
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}
