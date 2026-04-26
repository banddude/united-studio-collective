"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServicesBanner from "../components/ServicesBanner";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import photographyData from "../../content/photography.json";

interface Project {
  slug: string;
  name: string;
  description?: string;
  hero: string;
  images: string[];
}

interface PhotoImage {
  src: string;
  thumb?: string;
  medium?: string;
  full?: string;
  description: string;
  project?: string;
}

// Get projects for hero section
const projects = (photographyData.projects as Project[]) || [];

// Get standalone images (not linked to a project) for the gallery
// Pull a stable photo id from the filename so /photography#photo-<id> can
// scroll the user to a specific image. Wix-derived filenames look like
// "thumb_963954_<hash>~mv2.jpg" — the hash is what's unique.
function photoIdFromSrc(srcPath: string): string {
  const file = srcPath.split("/").pop() || srcPath;
  const stripped = file
    .replace(/^thumb_|^medium_|^full_/, "")
    .replace(/\.(jpg|jpeg|png|webp)$/i, "");
  return stripped.replace(/~mv2$/, "");
}

const galleryPhotos = (photographyData.images as PhotoImage[])
  .filter(img => !img.project)
  .map(img => ({
    id: photoIdFromSrc(img.src),
    // Use thumb for grid, fallback to src if no thumb exists
    thumb: img.thumb || img.src,
    // Use full for lightbox, fallback to src if no full exists
    full: img.full || img.src,
    alt: img.description
  }));

export default function PhotographyPage() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  // If the URL targets a specific photo via #photo-<id>, open the lightbox
  // to that image once on mount. Honors deep links from the Services page.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash || "";
    const m = hash.match(/^#photo-(.+)$/);
    if (!m) return;
    const targetId = m[1];
    const idx = galleryPhotos.findIndex((p) => p.id === targetId);
    if (idx >= 0) {
      setSelectedImageIndex(idx);
    }
  }, []);

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
      prev === 0 ? galleryPhotos.length - 1 : (prev as number) - 1
    );
  }, [selectedImageIndex]);

  const goToNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) =>
      prev === galleryPhotos.length - 1 ? 0 : (prev as number) + 1
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
        {/* Project Heroes - Clickable links to project galleries */}
        {projects.length > 0 && (
          <div className="space-y-2 mb-2">
            {projects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/photography/project/${project.slug}`}
                className="block relative w-full h-[50vh] md:h-[70vh] group overflow-hidden"
              >
                <Image
                  src={project.hero}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={index === 0}
                  unoptimized
                />
                {/* Overlay with project name */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-white text-3xl md:text-5xl font-light tracking-wide drop-shadow-lg">
                      {project.name}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Gallery
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Photo Gallery - 2 columns on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-[2px] sm:gap-[5px] bg-white">
          {galleryPhotos.map((photo, index) => (
            <div
              key={index}
              id={`photo-${photo.id}`}
              className="relative aspect-square overflow-hidden cursor-pointer group scroll-mt-[150px]"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={photo.thumb}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 33vw"
                unoptimized
                loading={index < 6 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </main>

      <ServicesBanner />


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

          {/* Image Container - Uses full resolution for lightbox */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryPhotos[selectedImageIndex].full}
              alt={galleryPhotos[selectedImageIndex].alt}
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
            {selectedImageIndex + 1} / {galleryPhotos.length}
          </div>
        </div>
      )}
    </div>
  );
}
