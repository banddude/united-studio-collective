"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Youtube, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import collectiveData from "../../content/collective.json";
import transcriptText from "../../content/jessica-maxwell-interview-transcript.txt";

interface Member {
  name: string;
  role: string;
  bio: string;
  image: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  storeSlug?: string;
}

// Parse transcript into speaker segments
function parseTranscript(text: string): { speaker: string; text: string }[] {
  const lines = text.split('\n').filter(line => line.trim());
  const segments: { speaker: string; text: string }[] = [];
  let currentSpeaker = '';

  for (const line of lines) {
    // Skip the title line
    if (line.includes('11:41 AM')) continue;

    // Check if this is a speaker line (ends with colon)
    if (line.match(/^[A-Za-z\s]+:$/)) {
      currentSpeaker = line.replace(':', '').trim();
    } else if (currentSpeaker) {
      segments.push({ speaker: currentSpeaker, text: line });
    }
  }

  return segments;
}

export default function CollectivePage() {
  const [showTranscript, setShowTranscript] = useState(false);
  const transcriptSegments = parseTranscript(transcriptText);

  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="The Collective" />

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

          {/* Team Members - Featured Artist Style Cards */}
          <div className="space-y-16">
            {(collectiveData.members as Member[]).map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 md:p-10"
              >
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                  {/* Left Side - Info */}
                  <div className="flex-1 text-center md:text-left order-2 md:order-1">
                    <h2 className="text-2xl md:text-3xl font-light text-black mb-4">
                      {member.name}
                    </h2>

                    {/* Artist Website Button */}
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-black text-white px-6 py-2 text-sm hover:bg-gray-800 transition-colors mb-6"
                      >
                        Artist Website
                      </a>
                    )}

                    {/* Bio */}
                    <p className="text-gray-600 leading-relaxed mb-6 max-w-lg">
                      {member.bio}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                      {/* Interview Button (placeholder for future) */}
                      {member.youtube && (
                        <a
                          href={member.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2 text-sm hover:bg-gray-700 transition-colors"
                        >
                          Interview
                        </a>
                      )}

                      {/* Social Icons */}
                      <div className="flex items-center gap-3">
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-black transition-colors"
                            aria-label={`${member.name} Instagram`}
                          >
                            <Instagram size={22} />
                          </a>
                        )}
                        {member.youtube && (
                          <a
                            href={member.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-600 hover:text-red-700 transition-colors"
                            aria-label={`${member.name} YouTube`}
                          >
                            <Youtube size={24} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* View Collection Link */}
                    {member.storeSlug && (
                      <div className="mt-6">
                        <Link
                          href={`/store/artist/${member.storeSlug}`}
                          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors underline underline-offset-4"
                        >
                          View Store Collection
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Photo */}
                  <div className="w-56 md:w-72 flex-shrink-0 order-1 md:order-2">
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
                </div>

                {/* Interview Video Section */}
                {member.youtube && (
                  <div className="mt-10 pt-10 border-t border-gray-200">
                    <h3 className="text-xl font-light text-black mb-6">Interview with {member.name.split(' ')[0]}</h3>

                    {/* Video Embed */}
                    <div className="relative w-full aspect-video bg-black mb-6">
                      <iframe
                        src={`https://www.youtube.com/embed/${member.youtube}`}
                        title={`Interview with ${member.name}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>

                    {/* Transcript Section */}
                    <div className="bg-white border border-gray-200">
                      <button
                        onClick={() => setShowTranscript(!showTranscript)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">Interview Transcript</span>
                        {showTranscript ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </button>

                      {showTranscript && (
                        <div className="px-6 pb-6 max-h-[500px] overflow-y-auto">
                          <div className="space-y-4">
                            {transcriptSegments.map((segment, i) => (
                              <div key={i}>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  {segment.speaker}
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {segment.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
