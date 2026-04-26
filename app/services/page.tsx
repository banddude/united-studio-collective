"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import servicesData from "../../content/services.json";
import { ArrowRight, Play } from "lucide-react";

interface BreakdownItem {
  label: string;
  subitems?: string[];
}

interface BreakdownSection {
  title: string;
  items: BreakdownItem[];
}

interface GalleryItem {
  image: string;
  caption?: string;
  href?: string;
  description?: string;
}

export default function ServicesPage() {
  const breakdown = servicesData.breakdown as
    | { title: string; subtitle: string; sections: BreakdownSection[] }
    | undefined;
  const reelCta = servicesData.reelCta as
    | { title: string; description: string; buttonText: string; buttonLink: string }
    | undefined;
  const gallery = (servicesData as { gallery?: GalleryItem[] }).gallery || [];
  const galleryHeading = (servicesData as { galleryHeading?: string }).galleryHeading;
  const gallerySubtitle = (servicesData as { gallerySubtitle?: string }).gallerySubtitle;

  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="Services" />

      <main className="pt-[120px] md:pt-[150px]">
        {/* Hero */}
        <section className="px-4 md:px-8 pb-12 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">
              {servicesData.page === "services" ? "Services" : "Services"}
            </p>
            <h1 className="text-4xl md:text-6xl font-light text-black mb-6">
              {servicesData.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
              {servicesData.subtitle}
            </p>
          </div>
        </section>

        {/* Recent work strip — visual without committing to a service-list framing */}
        {gallery.length > 0 && (
          <section className="px-4 md:px-8 pb-16 md:pb-24">
            <div className="max-w-6xl mx-auto">
              {(galleryHeading || gallerySubtitle) && (
                <div className="mb-8 md:mb-10 flex items-end justify-between gap-6">
                  <div>
                    {galleryHeading && (
                      <h2 className="text-xl md:text-2xl font-light text-black">
                        {galleryHeading}
                      </h2>
                    )}
                    {gallerySubtitle && (
                      <p className="text-sm md:text-base text-gray-600 mt-1 max-w-2xl">
                        {gallerySubtitle}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {gallery.map((item, i) => {
                  const tile = (
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 group">
                      <Image
                        src={item.image}
                        alt={item.description || item.caption || "United Studio Collective"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                      {(item.caption || item.description) && (
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 md:p-5">
                          {item.caption && (
                            <span className="text-white text-xs uppercase tracking-[0.25em] block">
                              {item.caption}
                            </span>
                          )}
                          {item.description && (
                            <span className="text-white/80 text-sm font-light mt-1 block">
                              {item.description}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                  return item.href ? (
                    <Link
                      key={i}
                      href={item.href}
                      className="block focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {tile}
                    </Link>
                  ) : (
                    <div key={i}>{tile}</div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Service Breakdown */}
        {breakdown && (
          <section className="px-4 md:px-8 pb-16 md:pb-24 bg-gray-50 py-16 md:py-20 border-y border-gray-200">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 md:mb-16">
                <h2 className="text-3xl md:text-5xl font-light text-black mb-4">
                  {breakdown.title}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {breakdown.subtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {breakdown.sections.map((section) => (
                  <div
                    key={section.title}
                    className="border-t border-black pt-6"
                  >
                    <h3 className="text-xl md:text-2xl font-light text-black mb-6 tracking-wide uppercase">
                      {section.title}
                    </h3>
                    <ul className="space-y-4">
                      {section.items.map((item, i) => (
                        <li key={i}>
                          <div className="flex items-start gap-3 text-gray-800">
                            <span className="text-black mt-[10px] flex-shrink-0 w-1 h-1 rounded-full bg-black" />
                            <span className="leading-snug">{item.label}</span>
                          </div>
                          {item.subitems && item.subitems.length > 0 && (
                            <ul className="mt-2 ml-5 space-y-1.5 text-sm text-gray-500">
                              {item.subitems.map((sub, j) => (
                                <li key={j} className="leading-snug">
                                  — {sub}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reel CTA — sells on quality before pushing to contact */}
        {reelCta && (
          <section className="bg-white py-12 md:py-16 px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-light text-black mb-3">
                {reelCta.title}
              </h2>
              <p className="text-gray-600 mb-6">{reelCta.description}</p>
              <Link
                href={reelCta.buttonLink}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                <Play className="w-4 h-4" fill="currentColor" />
                {reelCta.buttonText}
              </Link>
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section className="bg-black text-white py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4">
              {servicesData.cta.title}
            </h2>
            <p className="text-gray-400 mb-6">
              {servicesData.cta.description}
            </p>
            <Link
              href={servicesData.cta.buttonLink}
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors"
            >
              {servicesData.cta.buttonText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
