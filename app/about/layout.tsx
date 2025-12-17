import { ReactNode } from "react";
export { metadata } from "./metadata";

const baseUrl = "https://banddude.github.io/united-studio-collective";

// Person schema for Evan Rene
const evanSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Evan Rene",
  jobTitle: "Filmmaker & Director",
  description: "Filmmaker and director at United Studio Collective. Creates compelling thought-provoking stories through filmmaking and photography.",
  image: "https://static.wixstatic.com/media/963954_3739d7b048214741981aa5eae48a6f96~mv2.jpg",
  worksFor: {
    "@type": "Organization",
    name: "United Studio Collective",
    url: baseUrl,
  },
  knowsAbout: ["Filmmaking", "Photography", "Video Production", "Fashion Films"],
  sameAs: [
    "https://www.instagram.com/unitedstudiocollective",
  ],
};

// Person schema for Katie Chew
const katieSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Katie Chew",
  jobTitle: "Fashion Photographer",
  description: "Fashion photographer from the Midwest who moved to Los Angeles to work with other creatives in fashion. Gets inspiration from movies and high fashion magazines.",
  image: "https://static.wixstatic.com/media/2e5994_ee9ab9817e874646a6eefb52054c52a8~mv2.png",
  worksFor: {
    "@type": "Organization",
    name: "United Studio Collective",
    url: baseUrl,
  },
  knowsAbout: ["Fashion Photography", "Creative Direction", "Photography"],
};

// AboutPage schema
const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About United Studio Collective",
  description: "Learn about United Studio Collective, a Los Angeles based video production company, and meet our team of creative filmmakers and photographers.",
  url: `${baseUrl}/about`,
  mainEntity: {
    "@type": "Organization",
    name: "United Studio Collective",
    description: "Los Angeles based video production company specializing in fashion films, experimental shorts, and analog/digital photography.",
    url: baseUrl,
    member: [
      {
        "@type": "Person",
        name: "Evan Rene",
        jobTitle: "Filmmaker & Director",
      },
      {
        "@type": "Person",
        name: "Katie Chew",
        jobTitle: "Fashion Photographer",
      },
    ],
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(evanSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(katieSchema) }}
      />
      {children}
    </>
  );
}
