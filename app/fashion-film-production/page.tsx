import type { Metadata } from "next";
import EditorialPage from "../components/EditorialPage";
import pageData from "../../content/fashion-film-production.json";

const baseUrl = "https://unitedstudiocollective.com";

export const metadata: Metadata = {
  title: { absolute: pageData.title },
  description: pageData.description,
  openGraph: { title: pageData.title, description: pageData.description, url: `${baseUrl}/fashion-film-production/` },
  twitter: { card: "summary_large_image", title: pageData.title, description: pageData.description },
  alternates: { canonical: `${baseUrl}/fashion-film-production/` },
};

export default function Page() {
  return <EditorialPage page={pageData} />;
}
