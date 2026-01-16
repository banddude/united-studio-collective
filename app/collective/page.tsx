import Image from "next/image";
import Link from "next/link";
import { Instagram, ExternalLink, Headphones } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import collectiveData from "../../content/collective.json";
import { toThumbPath } from "../lib/store-data";

interface Member {
  name: string;
  role: string;
  bio: string;
  image: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  audioUrl?: string;
  storeSlug?: string;
}

function artistToSlug(artist: string): string {
  return artist.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CollectivePage() {
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

                    {/* Bio */}
                    <p className="text-gray-600 leading-relaxed mb-6 max-w-lg">
                      {member.bio}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                      {/* Interview Button - links to interview page */}
                      {member.youtube && (
                        <Link
                          href={`/collective/interview/${artistToSlug(member.name)}`}
                          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 text-sm hover:bg-gray-700 transition-colors"
                        >
                          Watch Interview
                        </Link>
                      )}

                      {/* Audio Interview Button */}
                      {member.audioUrl && (
                        <a
                          href={member.audioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gray-700 text-white px-5 py-2.5 text-sm hover:bg-gray-600 transition-colors"
                        >
                          <Headphones size={16} />
                          Listen
                        </a>
                      )}

                      {/* Instagram Button */}
                      {member.instagram && (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 text-sm hover:from-purple-600 hover:to-pink-600 transition-colors"
                        >
                          <Instagram size={16} />
                          Instagram
                        </a>
                      )}

                      {/* Website Button */}
                      {member.website && (
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 text-sm hover:bg-gray-100 transition-colors"
                        >
                          <ExternalLink size={16} />
                          Website
                        </a>
                      )}
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

                    {/* Transcript Snippet */}
                    {member.youtube && (
                      <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">From the Interview</p>
                        <p className="text-sm text-gray-600 italic leading-relaxed line-clamp-4">
                          &ldquo;When I was about 12 years old, I was standing in my room, and I just remember feeling the weight of the world... I remember having a National Geographic magazine cover in my hands, and it was Steve McCurry&apos;s Afghan Girl. I just remember feeling like when I get through this thing, I want to create safe spaces in the world where people get to tell their story.&rdquo;
                        </p>
                        <Link
                          href={`/collective/interview/${artistToSlug(member.name)}`}
                          className="inline-block mt-3 text-xs text-gray-500 hover:text-black transition-colors underline underline-offset-2"
                        >
                          Read full transcript
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Photo */}
                  <div className="w-56 md:w-72 flex-shrink-0 order-1 md:order-2">
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                      <Image
                        src={toThumbPath(member.image)}
                        alt={member.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
