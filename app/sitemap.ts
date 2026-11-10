import { MetadataRoute } from "next";
import { getAllProducts, getAllArtists, artistToSlug } from "./lib/store-data";
import collectiveData from "../content/collective.json";
import photographyData from "../content/photography.json";

export const dynamic = "force-static";

const baseUrl = "https://unitedstudiocollective.com";

interface Member {
  name: string;
  youtube?: string;
}

// Mirrors the collective interview page: only members with a video get an
// interview page, so only they belong in the sitemap.
function getInterviewSlugs(): string[] {
  const data = collectiveData as unknown as {
    headliner?: Member;
    pastArtists?: Member[];
    members?: Member[];
  };
  const members: Member[] = [];
  if (data.headliner) members.push(data.headliner);
  if (Array.isArray(data.pastArtists)) members.push(...data.pastArtists);
  if (Array.isArray(data.members)) members.push(...data.members);
  return members
    .filter((m) => m.youtube)
    .map((m) => artistToSlug(m.name));
}

function getPhotographyProjectSlugs(): string[] {
  const projects = (photographyData.projects as { slug: string }[]) || [];
  return projects.map((project) => project.slug);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "about/",
    "cart/",
    "collective/",
    "contact/",
    "fashion-film-production/",
    "fashion-film-production-cost/",
    "filmmaking/",
    "photography/",
    "services/",
    "store/",
    "store/archive/",
    "store/winter-spring-26/",
  ];

  const dynamicRoutes = [
    ...getInterviewSlugs().map((slug) => `collective/interview/${slug}/`),
    ...getPhotographyProjectSlugs().map((slug) => `photography/project/${slug}/`),
    ...getAllArtists().map((artist) => `store/artist/${artistToSlug(artist)}/`),
    ...getAllProducts().map((product) => `store/product/${product.id}/`),
  ];

  return [...staticRoutes, ...dynamicRoutes].map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
