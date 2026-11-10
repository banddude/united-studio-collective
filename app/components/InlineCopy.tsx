import Link from "next/link";
import { Fragment } from "react";

const links: Record<string, string> = {
  "fashion film production cost guide": "/fashion-film-production-cost/",
  "fashion film production page": "/fashion-film-production/",
  "Filmmaking page": "/filmmaking/",
  "photography gallery": "/photography/",
  "Collective page": "/collective/",
  "Services page": "/services/",
  "contact form": "/contact/",
};
const linkedPhrases = new RegExp(`(${Object.keys(links).join("|")})`, "g");

export default function InlineCopy({ text }: { text: string }) {
  return <>{text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index} className="font-medium text-black">{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={index}>{part.split(linkedPhrases).map((phrase, linkIndex) => links[phrase]
      ? <Link key={linkIndex} href={links[phrase]} className="text-black underline underline-offset-4 hover:opacity-60">{phrase}</Link>
      : phrase)}</Fragment>;
  })}</>;
}
