import Image from "next/image";
import Link from "next/link";
import { Instagram, ExternalLink, ArrowLeft, Headphones } from "lucide-react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import collectiveData from "../../../../content/collective.json";
import transcriptText from "../../../../content/jessica-maxwell-interview-transcript.txt";
import { notFound } from "next/navigation";

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

function artistToSlug(artist: string): string {
  return artist.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractYouTubeId(url: string): string {
  // Handle youtu.be/VIDEO_ID format
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com/watch?v=VIDEO_ID format
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (longMatch) return longMatch[1];

  // Already just an ID
  return url;
}

function getAllMembers(): Member[] {
  const data = collectiveData as unknown as {
    headliner?: Member;
    pastArtists?: Member[];
    members?: Member[]; // legacy fallback
  };
  const members: Member[] = [];
  if (data.headliner) members.push(data.headliner);
  if (Array.isArray(data.pastArtists)) members.push(...data.pastArtists);
  if (Array.isArray(data.members)) members.push(...data.members);
  return members;
}

export function generateStaticParams() {
  return getAllMembers()
    .filter(m => m.youtube)
    .map(m => ({
      slug: artistToSlug(m.name),
    }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function InterviewPage({ params }: PageProps) {
  const { slug } = await params;

  const member = getAllMembers().find(
    m => artistToSlug(m.name) === slug
  );

  const transcriptSegments = parseTranscript(transcriptText);

  if (!member || !member.youtube) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="The Collective" />

      <main className="pt-[120px] md:pt-[150px] pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Link */}
          <Link
            href="/collective"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8"
          >
            <ArrowLeft size={16} />
            Back to The Collective
          </Link>

          {/* Artist Profile Section */}
          <div className="bg-gray-50 p-6 md:p-10 mb-10">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
              {/* Left Side - Info */}
              <div className="flex-1 text-center md:text-left order-2 md:order-1">
                <h1 className="text-2xl md:text-3xl font-light text-black mb-4">
                  Interview with {member.name}
                </h1>

                {/* Bio */}
                <p className="text-gray-600 leading-relaxed mb-6 max-w-lg">
                  {member.bio}
                </p>

                {/* Links */}
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                  {member.website && (
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                    >
                      <ExternalLink size={16} />
                      Artist Website
                    </a>
                  )}
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
                  {member.audioUrl && (
                    <a
                      href={member.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                    >
                      <Headphones size={16} />
                      Listen to Interview
                    </a>
                  )}
                  {member.storeSlug && (
                    <Link
                      href={`/store/artist/${member.storeSlug}`}
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                    >
                      View Store Collection
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Side - Photo */}
              <div className="w-40 md:w-56 flex-shrink-0 order-1 md:order-2">
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

          {/* Video Section */}
          <div className="mb-10">
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(member.youtube)}`}
                title={`Interview with ${member.name}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          {/* Transcript Section */}
          <div>
            <h2 className="text-xl font-light text-black mb-6 pb-2 border-b border-gray-200">Transcript</h2>
            <div className="space-y-6">
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
