import Image from "next/image";
import Link from "next/link";
import { Instagram, ExternalLink, Headphones } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ServicesBanner from "../components/ServicesBanner";
import collectiveData from "../../content/collective.json";

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

function ArtistCard({ member, compact = false }: { member: Member; compact?: boolean }) {
  return (
    <div className={`bg-gray-50 ${compact ? "p-5 md:p-7" : "p-6 md:p-10"}`}>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
        {/* Info */}
        <div className="flex-1 text-center md:text-left order-2 md:order-1">
          <h2
            className={`font-light text-black mb-1 ${
              compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl mb-4"
            }`}
          >
            {member.name}
          </h2>
          <p className={`text-xs uppercase tracking-wider text-gray-500 mb-4 ${compact ? "" : "mb-4"}`}>
            {member.role}
          </p>

          <p
            className={`text-gray-600 leading-relaxed mb-6 max-w-lg ${
              compact ? "text-sm" : ""
            }`}
          >
            {member.bio}
          </p>

          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
            {member.youtube && (
              <Link
                href={`/collective/interview/${artistToSlug(member.name)}`}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 text-sm hover:bg-gray-700 transition-colors"
              >
                Watch Interview
              </Link>
            )}

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

        {/* Photo */}
        <div
          className={`flex-shrink-0 order-1 md:order-2 ${
            compact ? "w-44 md:w-56" : "w-56 md:w-72"
          }`}
        >
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
    </div>
  );
}

export default function CollectivePage() {
  const headliner = collectiveData.headliner as Member | undefined;
  const pastArtists = (collectiveData.pastArtists as Member[]) || [];

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

          {/* Headliner */}
          {headliner && (
            <section className="mb-20">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
                  Featured Artist
                </span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>
              <ArtistCard member={headliner} />
            </section>
          )}

          {/* Past Artists */}
          {pastArtists.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
                  Past Artists
                </span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="space-y-10">
                {pastArtists.map((member, index) => (
                  <ArtistCard key={index} member={member} compact />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <ServicesBanner />

      <Footer />
    </div>
  );
}
