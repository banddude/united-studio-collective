import { Metadata } from "next";

const baseUrl = "https://unitedstudiocollective.com";

export const metadata: Metadata = {
  title: "Shop Prints",
  description: "Shop photography prints by United Studio Collective. High-quality framed and frameless photographs available for purchase. 16x20 prints signed by the artist.",
  openGraph: {
    title: "Shop Prints | United Studio Collective",
    description: "Shop photography prints by United Studio Collective. High-quality framed and frameless photographs.",
    url: `${baseUrl}/store`,
    images: [
      {
        url: "https://static.wixstatic.com/media/963954_7d3c9ccd3b27414eb6485414f9e186dc~mv2.jpg",
        width: 542,
        height: 542,
        alt: "United Studio Collective Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Prints | United Studio Collective",
    description: "Shop photography prints by United Studio Collective.",
  },
  alternates: {
    canonical: `${baseUrl}/store`,
  },
};
