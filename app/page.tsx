"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ServicesBanner from "./components/ServicesBanner";
import homepageData from "../content/homepage-images.json";
import videosData from "./filmmaking/videos.json";

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  videoId: string;
  platform: "youtube" | "vimeo" | "local" | "pending";
  creator?: string;
  description?: string;
  hidden?: boolean;
}

const images = homepageData.gallery_images.map((img) => ({
  src: img.src,
  alt: img.description || img.alt,
  link: img.link || "/",
  label: (img as { label?: string }).label || ""
}));

export default function Home() {
  
  // Dynamically find the first non-hidden video from the filmmaking section
  const latestVideo = useMemo(() => {
    const videos = videosData as Video[];
    return videos.find(v => !v.hidden) || videos[0];
  }, []);

  // Split images: first one for the hero, the rest for after the video
  const firstImage = images[0];
  const remainingImages = images.slice(1);

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Scrollable Header overlaid on top of the first image */}
      <Header variant="dark" currentPage="Home" scrollable />

      <main className="flex flex-col">
        {/* 1. First Hero Image - Keeping this full screen for impact */}
        <Link
          href={firstImage.link}
          className="relative w-full block group h-screen"
        >
          <Image
            src={firstImage.src}
            alt={firstImage.alt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={80}
          />
          {firstImage.label && (
            <span
              aria-hidden="true"
              className="md:hidden pointer-events-none absolute inset-0 flex items-center justify-center text-center text-white/90 text-[12px] tracking-[0.4em] uppercase font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4"
            >
              {firstImage.label}
            </span>
          )}
        </Link>

        {/* 2. Hero Video Section - Slightly larger for impact */}
        <section className="relative w-full h-[60vh] md:h-[70vh] bg-black overflow-hidden group">
          <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
            {latestVideo.platform === 'youtube' ? (
              <div className="relative w-full h-full max-w-[180vh] aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${latestVideo.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${latestVideo.videoId}&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&showinfo=0`}
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none object-cover"
                  allow="autoplay; encrypted-media"
                  title={latestVideo.title}
                />
              </div>
            ) : latestVideo.platform === 'local' ? (
              <video 
                src={`/videos/${latestVideo.videoId}`}
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Video format not supported for background play.
              </div>
            )}
            
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />
          </div>
        </section>

        {/* 3. Compact High-Contrast CTA - Reduced padding to be even smaller */}
        <section className="bg-black text-white py-8 md:py-12 px-4 md:px-8 border-y border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-light mb-1 tracking-[0.1em] uppercase">
              Curious what we can do for you?
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-6 font-light tracking-wide">
              See the full range of production services United Studio Collective offers.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black text-xs font-semibold transition-all hover:bg-gray-200 hover:scale-105 active:scale-95 uppercase tracking-widest"
            >
              View Services
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </Link>
          </div>
        </section>

        {/* 4. Remaining images */}
        <div className="flex flex-col">
          {remainingImages.map((image) => (
            <Link
              key={image.src}
              href={image.link}
              className="relative w-full block group h-screen"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="100vw"
                quality={80}
              />
              {image.label && (
                <span
                  aria-hidden="true"
                  className="md:hidden pointer-events-none absolute inset-0 flex items-center justify-center text-center text-white/90 text-[12px] tracking-[0.4em] uppercase font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] px-4"
                >
                  {image.label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
