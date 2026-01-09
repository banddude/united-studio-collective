import { Metadata } from "next";

const baseUrl = "https://unitedstudiocollective.com";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the team behind United Studio Collective. Evan Rene leads our Los Angeles based video production company specializing in filmmaking and photography.",
  openGraph: {
    title: "About Us | United Studio Collective",
    description: "Meet the team behind United Studio Collective, a Los Angeles based video production company.",
    url: `${baseUrl}/about`,
    images: [
      {
        url: "https://static.wixstatic.com/media/963954_7c1e5fa77e944f5ba66f2a5032bf3801~mv2.jpg",
        width: 509,
        height: 501,
        alt: "United Studio Collective Team",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | United Studio Collective",
    description: "Meet the team behind United Studio Collective.",
  },
  alternates: {
    canonical: `${baseUrl}/about`,
  },
};
