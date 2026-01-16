import Image from "next/image";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
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

export default async function ProjectGalleryPage({ params }: PageProps) {
  const { slug } = await params;

  // Find the project
  const project = (photographyData.projects as Project[])?.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Get all images for this project
  const projectImages = project?.images?.length
    ? project.images.map(src => ({ src, alt: project.name }))
    : (photographyData.images as ImageData[])
        .filter(img => img.project === slug)
        .map(img => ({ src: img.src, alt: img.description }));

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

        {/* Hero Image */}
        <div className="relative w-full h-[50vh] md:h-[70vh] mb-2">
          <Image
            src={project.hero}
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

      <Footer />
    </div>
  );
}
