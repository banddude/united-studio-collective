import { Metadata } from "next";

const baseUrl = "https://banddude.github.io/united-studio-collective";

export const metadata: Metadata = {
  title: "Photography Gallery",
  description: "Explore our photography gallery featuring analog and digital photography. Fashion photography, portraits, and artistic shots by United Studio Collective in Los Angeles.",
  openGraph: {
    title: "Photography Gallery | United Studio Collective",
    description: "Explore our photography gallery featuring analog and digital photography.",
    url: `${baseUrl}/photography`,
    images: [
      {
        url: "https://static.wixstatic.com/media/963954_3b1ade74535044fcba87f864819ad9bf~mv2.jpg",
        width: 1200,
        height: 800,
        alt: "United Studio Collective Photography",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photography Gallery | United Studio Collective",
    description: "Explore our photography gallery featuring analog and digital photography.",
  },
  alternates: {
    canonical: `${baseUrl}/photography`,
  },
};
