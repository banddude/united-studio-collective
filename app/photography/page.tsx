"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import photographyData from "../../content/photography.json";

const allPhotos = photographyData.images.map(img => ({
  src: img.src,
  alt: img.description
}));

export default function PhotographyPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  // Handle body overflow when lightbox is open
  useEffect(() => {
    if (selectedImageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImageIndex]);

  const goToPrevious = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? allPhotos.length - 1 : (prev as number) - 1
    );
  }, [selectedImageIndex]);

  const goToNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === allPhotos.length - 1 ? 0 : (prev as number) + 1
    );
  }, [selectedImageIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, goToPrevious, goToNext]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header variant="light" currentPage="Photography" />

      {/* Main Content */}
      <main className="pt-[120px] md:pt-[150px]">
        {/* Photo Gallery - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-[2px] sm:gap-[5px] bg-white">
          {allPhotos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="33vw"
                unoptimized
                loading={index < 6 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            onClick={closeLightbox}
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          {/* Previous Button */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
          >
            <ChevronLeft size={48} strokeWidth={1.5} />
          </button>

          {/* Image Container */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allPhotos[selectedImageIndex].src}
              alt={allPhotos[selectedImageIndex].alt}
              fill
              className="object-contain"
              sizes="90vw"
              unoptimized
              priority
            />
          </div>

          {/* Next Button */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-50"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
          >
            <ChevronRight size={48} strokeWidth={1.5} />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {selectedImageIndex + 1} / {allPhotos.length}
          </div>
        </div>
      )}
    </div>
  );
}
