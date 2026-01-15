"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import collectiveData from "../../content/collective.json";

export default function CollectivePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="Collective" />

      <main className="pt-[120px] md:pt-[150px] pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-light text-center text-black mb-6">
            {collectiveData.title}
          </h1>

          {/* Description */}
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            {collectiveData.description}
          </p>

          {/* Team Members - Alternating 2-column layout */}
          <div className="space-y-16 md:space-y-24">
            {collectiveData.members.map((member, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row gap-8 md:gap-12 items-center ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Photo */}
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-light text-black mb-2">
                      {member.name}
                    </h3>
                    <p className="text-sm uppercase tracking-wider text-gray-500 mb-6">
                      {member.role}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
