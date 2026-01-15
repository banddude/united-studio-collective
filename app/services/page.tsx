"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import servicesData from "../../content/services.json";
import { ArrowRight, Check } from "lucide-react";

export default function ServicesPage() {
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
            <p className="text-lg md:text-xl text-gray-600 font-light">
              {servicesData.subtitle}
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            {servicesData.services.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={service.id}
                  className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center mb-20 md:mb-32 ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Image */}
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
              );
            })}
          </div>
        </section>

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
