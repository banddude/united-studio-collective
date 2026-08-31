import { Metadata } from "next";

const baseUrl = "https://unitedstudiocollective.com";

export const metadata: Metadata = {
  title: "Full Production Services",
  description: "Full production video services in Los Angeles. Pre-production, production, and post-production for fashion films, experimental shorts, and brand work. Concept to delivery, including gear packages, editing, color grading, and sound.",
  openGraph: {
    title: "Full Production Services | United Studio Collective",
    description: "Pre-production, production, and post-production for fashion films, experimental shorts, and brand work in Los Angeles.",
    url: `${baseUrl}/services`,
    images: [
      {
        url: `${baseUrl}/images/services/1769985480991_USC_JessieLayingDown1.jpg`,
        width: 1200,
        height: 800,
        alt: "United Studio Collective Full Production Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Production Services | United Studio Collective",
    description: "Pre-production, production, and post-production for fashion films, experimental shorts, and brand work in Los Angeles.",
  },
  alternates: {
    canonical: `${baseUrl}/services`,
  },
};
