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

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collectiveData.members.map((member, index) => (
              <div key={index} className="group">
                {/* Photo */}
                <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>

                {/* Info */}
                <h3 className="text-lg font-medium text-black mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
