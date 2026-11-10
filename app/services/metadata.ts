import type { Metadata } from "next";

const baseUrl = "https://unitedstudiocollective.com";

const title = "Video Production Company in Los Angeles | USC";
const description = "Los Angeles video production company for fashion films, brand work, and experimental shorts. Full crews, camera packages, editing, and color grading.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: {
    title,
    description,
    url: `${baseUrl}/services/`,
    images: [
      {
        url: `${baseUrl}/images/services/1769985480991_USC_JessieLayingDown1.jpg`,
        width: 1200,
        height: 800,
        alt: "United Studio Collective Video Production Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  alternates: {
    canonical: `${baseUrl}/services/`,
  },
};
