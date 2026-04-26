import Image from "next/image";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import ServicesBanner from "../../../components/ServicesBanner";
import { ArrowLeft } from "lucide-react";
import photographyData from "../../../../content/photography.json";
import { notFound } from "next/navigation";
import ProjectGallery from "./ProjectGallery";

interface Project {
  slug: string;
  name: string;
  description?: string;
  hero: string;
  images: string[];
}

interface ImageData {
  src: string;
  thumb?: string;
  medium?: string;
  full?: string;
  description: string;
  project?: string;
}

export function generateStaticParams() {
  const projects = (photographyData.projects as Project[]) || [];
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Photography images follow the convention <dir>/<file> with medium_<file>
// and thumb_<file> siblings. This swaps to the medium variant when present
// in the path; if the path already uses thumb_/medium_ it returns as-is.
function getMediumPhotoPath(src: string): string {
  if (!src) return src;
  const slash = src.lastIndexOf('/');
  if (slash < 0) return src;
  const dir = src.slice(0, slash);
  const file = src.slice(slash + 1);
  if (file.startsWith('medium_') || file.startsWith('thumb_') || file.startsWith('full_')) {
    return src;
  }
  return `${dir}/medium_${file}`;
}

export default async function ProjectGalleryPage({ params }: PageProps) {
  const { slug } = await params;

  // Find the project
  const project = (photographyData.projects as Project[])?.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Get all images for this project with thumb/medium/full support
  const projectImages = project?.images?.length
    ? project.images.map(src => ({ src, alt: project.name }))
    : (photographyData.images as ImageData[])
        .filter(img => img.project === slug)
        .map(img => ({
          src: img.src,
          thumb: img.thumb || img.src,
          medium: img.medium || img.src,
          full: img.full || img.src,
          alt: img.description
        }));

  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="Photography" />

      <main className="pt-[120px] md:pt-[150px]">
        {/* Back Link & Title */}
        <div className="px-4 md:px-8 mb-6">
          <Link
            href="/photography"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft size={16} />
            Back to Photography
          </Link>
          <h1 className="text-3xl md:text-4xl font-light text-black">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 mt-2 max-w-2xl">{project.description}</p>
          )}
        </div>

        {/* Hero Image (use medium-resolution version when available) */}
        <div className="relative w-full h-[50vh] md:h-[70vh] mb-2">
          <Image
            src={getMediumPhotoPath(project.hero)}
            alt={project.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </div>

        {/* Gallery with Lightbox (client component) */}
        <ProjectGallery images={projectImages} />
      </main>

      <ServicesBanner
        title="Like what you see?"
        description="United Studio Collective brings full production to fashion films, music videos, and experimental work. See the services."
      />

      <Footer />
    </div>
  );
}
