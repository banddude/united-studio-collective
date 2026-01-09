import { Metadata } from "next";

const baseUrl = "https://unitedstudiocollective.com";

export const metadata: Metadata = {
  title: "Filmmaking Portfolio",
  description: "Watch our filmmaking portfolio featuring fashion films, experimental shorts, and music videos. United Studio Collective produces creative video content in Los Angeles.",
  openGraph: {
    title: "Filmmaking Portfolio | United Studio Collective",
    description: "Watch our filmmaking portfolio featuring fashion films, experimental shorts, and music videos.",
    url: `${baseUrl}/filmmaking`,
    images: [
      {
        url: "https://static.wixstatic.com/media/2e5994_a7ef47d637bb48b29c7d90e283a85118~mv2.jpg",
        width: 1920,
        height: 1080,
        alt: "United Studio Collective 2024 Reel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Filmmaking Portfolio | United Studio Collective",
    description: "Watch our filmmaking portfolio featuring fashion films and experimental shorts.",
  },
  alternates: {
    canonical: `${baseUrl}/filmmaking`,
  },
};
