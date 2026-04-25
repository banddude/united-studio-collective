"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import servicesData from "../../content/services.json";
import { ArrowRight, Check, Play } from "lucide-react";

interface BreakdownItem {
  label: string;
  subitems?: string[];
}

interface BreakdownSection {
  title: string;
  items: BreakdownItem[];
}

export default function ServicesPage() {
  const breakdown = servicesData.breakdown as
    | { title: string; subtitle: string; sections: BreakdownSection[] }
    | undefined;
  const reelCta = servicesData.reelCta as
    | { title: string; description: string; buttonText: string; buttonLink: string }
    | undefined;

  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="Services" />

      <main className="pt-[120px] md:pt-[150px]">
        {/* Hero Section */}
        <section className="px-4 md:px-8 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-light text-black mb-6">
              {servicesData.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-light whitespace-pre-line">
              {servicesData.subtitle}
            </p>
          </div>
        </section>

        {/* Services Grid - photos always on the left */}
        <section className="px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {servicesData.services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col md:flex-row gap-8 md:gap-16 items-center mb-20 md:mb-32"
              >
                {/* Image - always on the left on desktop */}
                <div className="w-full md:w-1/2">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <h2 className="text-2xl md:text-4xl font-light text-black mb-4">
                    {service.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-700">
                        <Check className="w-5 h-5 text-black flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Service Breakdown - structured pricing-shape outline */}
        {breakdown && (
          <section className="px-4 md:px-8 pb-20 md:pb-28">
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

        {/* Reel CTA - sells on quality before contact */}
        {reelCta && (
          <section className="bg-gray-50 py-12 md:py-16 px-4 md:px-8 border-y border-gray-200">
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

        {/* CTA Section */}
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
