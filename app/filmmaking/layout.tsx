import { ReactNode } from "react";
export { metadata } from "./metadata";

const baseUrl = "https://banddude.github.io/united-studio-collective";

// VideoObject schema for all videos
const videoSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "United Studio Collective 2024 Reel",
    description: "United Studio Collective's 2024 Reel showcasing our best work in filmmaking and video production.",
    thumbnailUrl: "https://static.wixstatic.com/media/2e5994_a7ef47d637bb48b29c7d90e283a85118~mv2.jpg",
    uploadDate: "2024-01-01",
    duration: "PT36S",
    contentUrl: "https://www.youtube.com/watch?v=NO4KgrvH4Dg",
    embedUrl: "https://www.youtube.com/embed/NO4KgrvH4Dg",
    publisher: {
      "@type": "Organization",
      name: "United Studio Collective",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Light / Dark",
    description: "A collaboration of architecture and fashion. Directed By: Ion Tong & Evan Rene. Produced By: United Studio Collective.",
    thumbnailUrl: "https://static.wixstatic.com/media/963954_fd3646aa5154494a9dc98c2757b08cf9~mv2.jpg",
    uploadDate: "2023-01-01",
    duration: "PT1M24S",
    contentUrl: `${baseUrl}/videos/light-dark.mp4`,
    publisher: {
      "@type": "Organization",
      name: "United Studio Collective",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Delikate Rayne Fashion Shoot",
    description: "Fashion shoot for Delikate Rayne by Evan Rene.",
    thumbnailUrl: "https://vumbnail.com/867541676.jpg",
    uploadDate: "2022-01-01",
    duration: "PT1M54S",
    contentUrl: "https://vimeo.com/867541676",
    embedUrl: "https://player.vimeo.com/video/867541676",
    publisher: {
      "@type": "Organization",
      name: "United Studio Collective",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "The Seasons of Fall",
    description: "A piece of trash on the corner of the street. The looming extinction of Mankind. Director: Ion Tong & Evan Rene. Produced By: United Studio Collective.",
    thumbnailUrl: "https://img.youtube.com/vi/Mwe9xCaLLBM/maxresdefault.jpg",
    uploadDate: "2021-01-01",
    duration: "PT3M30S",
    contentUrl: "https://www.youtube.com/watch?v=Mwe9xCaLLBM",
    embedUrl: "https://www.youtube.com/embed/Mwe9xCaLLBM",
    publisher: {
      "@type": "Organization",
      name: "United Studio Collective",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Blackmagic URSA Mini Pro Fashion Film: The Rae Sisters",
    description: "Using the Blackmagic URSA Mini Pro, we asked some friends to help us with a short fashion film/camera test. Featuring: The Rae Sisters.",
    thumbnailUrl: "https://img.youtube.com/vi/HBXVsbKGq4s/maxresdefault.jpg",
    uploadDate: "2020-01-01",
    duration: "PT59S",
    contentUrl: "https://www.youtube.com/watch?v=HBXVsbKGq4s",
    embedUrl: "https://www.youtube.com/embed/HBXVsbKGq4s",
    publisher: {
      "@type": "Organization",
      name: "United Studio Collective",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Through The Night",
    description: "A short film based on the feelings and emotions we all experience through life. Shown through the lens of a night drive through Los Angeles. Shot on Blackmagic URSA Mini Pro.",
    thumbnailUrl: "https://img.youtube.com/vi/kg1EDL-O5zI/maxresdefault.jpg",
    uploadDate: "2020-01-01",
    duration: "PT3M30S",
    contentUrl: "https://www.youtube.com/watch?v=kg1EDL-O5zI",
    embedUrl: "https://www.youtube.com/embed/kg1EDL-O5zI",
    publisher: {
      "@type": "Organization",
      name: "United Studio Collective",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "A Friendship Divided",
    description: "A collection of shots from various films shot by Ion Tong and Evan Rene. Directed by Ion Tong.",
    thumbnailUrl: "https://static.wixstatic.com/media/963954_5d4dbea05d6b47f3bf62b0e182a08190~mv2.jpg",
    uploadDate: "2019-01-01",
    duration: "PT1M30S",
    contentUrl: "https://vimeo.com/534300555",
    embedUrl: "https://player.vimeo.com/video/534300555",
    publisher: {
      "@type": "Organization",
      name: "United Studio Collective",
    },
  },
];

// ItemList schema for video gallery
const videoListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "United Studio Collective Filmmaking Portfolio",
  description: "Video production portfolio featuring fashion films, experimental shorts, and music videos.",
  numberOfItems: 7,
  itemListElement: videoSchemas.map((video, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "VideoObject",
      name: video.name,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
    },
  })),
};

export default function FilmmakingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoListSchema) }}
      />
      {videoSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
