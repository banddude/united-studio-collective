"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const allPhotos = [
  {
    src: "https://static.wixstatic.com/media/963954_3b1ade74535044fcba87f864819ad9bf~mv2.jpg",
    alt: "B&W silhouette person at window",
  },
  {
    src: "https://static.wixstatic.com/media/963954_fac333b082b54599afa0d5a3ed3f18b8~mv2.jpg",
    alt: "Blurry abstract B&W",
  },
  {
    src: "https://static.wixstatic.com/media/963954_c62af60703dd4601859d5cee56ff3e17~mv2.jpg",
    alt: "Sand dunes with person",
  },
  {
    src: "https://static.wixstatic.com/media/963954_81382f1afcf74f6d83d8f3d9063801b8~mv2.jpg",
    alt: "Dark hallway with light",
  },
  {
    src: "https://static.wixstatic.com/media/963954_68c785f9dcc04d579553545aeba44046~mv2.jpg",
    alt: "Woman portrait in greenery",
  },
  {
    src: "https://static.wixstatic.com/media/963954_6f8bb6be5e1e487c80d32a1e7b748e53~mv2.jpg",
    alt: "Woman on rooftop blue sky",
  },
  {
    src: "https://static.wixstatic.com/media/963954_d1783f6f4df14475a4b284c0613f5421~mv2.jpg",
    alt: "Photography 7",
  },
  {
    src: "https://static.wixstatic.com/media/963954_eb2bd2b814ae463cb4ece85f31f3ba82~mv2.jpg",
    alt: "Photography 8",
  },
  {
    src: "https://static.wixstatic.com/media/963954_d27a6224206d4d16ab6ef4b1bf0dd22f~mv2.jpg",
    alt: "Photography 9",
  },
  {
    src: "https://static.wixstatic.com/media/963954_ef108d6e5a8d45df802b42e2fbb1a622~mv2.jpg",
    alt: "Photography 10",
  },
  {
    src: "https://static.wixstatic.com/media/963954_791e46b96a10452a9528d133d5502f8d~mv2.jpg",
    alt: "Photography 11",
  },
  {
    src: "https://static.wixstatic.com/media/963954_9162cbdd78c549109f68bfb3681de0eb~mv2.jpg",
    alt: "Photography 12",
  },
  {
    src: "https://static.wixstatic.com/media/963954_11cb3155ab8e4e38a0f9717be22b92cb~mv2.jpg",
    alt: "Photography 13",
  },
  {
    src: "https://static.wixstatic.com/media/963954_4933b5ab12464294b400991231229f57~mv2.jpg",
    alt: "Photography 14",
  },
  {
    src: "https://static.wixstatic.com/media/963954_b7ee330edde1484c8467994fa2055a68~mv2.jpg",
    alt: "Photography 15",
  },
  {
    src: "https://static.wixstatic.com/media/963954_2bcbe6c57e684d578daebd843560ad51~mv2.jpg",
    alt: "Photography 16",
  },
  {
    src: "https://static.wixstatic.com/media/963954_936141ee69a7494bbdd7b525e2ea9966~mv2.jpg",
    alt: "Photography 17",
  },
  {
    src: "https://static.wixstatic.com/media/963954_947b53c1c87042ce9cbabae881ff2a86~mv2.jpg",
    alt: "Photography 18",
  },
  {
    src: "https://static.wixstatic.com/media/963954_49cf68b436e549588d240e653afd521c~mv2.jpg",
    alt: "Photography 19",
  },
  {
    src: "https://static.wixstatic.com/media/963954_f91dc0ebdd0646abb543ffa4822b4dfb~mv2.jpg",
    alt: "Photography 20",
  },
  {
    src: "https://static.wixstatic.com/media/963954_8c4bad9f1361409ea1d1b00c130a7842~mv2.jpg",
    alt: "Photography 21",
  },
  {
    src: "https://static.wixstatic.com/media/963954_8faeddd94cc54360b396f40c2c878ab3~mv2.jpg",
    alt: "Photography 22",
  },
  {
    src: "https://static.wixstatic.com/media/963954_4c232f8a81a4448a93a48944e4fb3488~mv2.jpg",
    alt: "Photography 23",
  },
];

export default function PhotographyPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = "unset";
  };

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
      <main className="pt-[100px] md:pt-[130px]">
        {/* Photo Gallery - 3 column grid with small gaps */}
        <div className="grid grid-cols-3 gap-[5px] bg-white">
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

        {/* Back to Top Button */}
        <div className="flex justify-center py-12">
          <button
            onClick={handleBackToTop}
            className="px-10 py-3 bg-black text-white text-sm tracking-wide hover:bg-gray-800 transition-colors"
          >
            Back to Top
          </button>
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
