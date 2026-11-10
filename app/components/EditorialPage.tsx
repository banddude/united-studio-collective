import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import InlineCopy from "./InlineCopy";

interface EditorialContent {
  eyebrow: string;
  h1: string;
  intro: string;
  sections: { title: string; paragraphs: string[] }[];
}

export default function EditorialPage({ page }: { page: EditorialContent }) {
  return (
    <div className="min-h-screen bg-white">
      <Header variant="light" currentPage="Services" />
      <main className="pt-[120px] md:pt-[150px]">
        <section className="px-4 md:px-8 pb-12 md:pb-20 border-b border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4">{page.eyebrow}</p>
            <h1 className="text-4xl md:text-6xl font-light text-black mb-6">{page.h1}</h1>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed"><InlineCopy text={page.intro} /></p>
          </div>
        </section>
        <article className="px-4 md:px-8 py-12 md:py-20">
          <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
            {page.sections.map(section => (
              <section key={section.title}>
                <h2 className="text-2xl md:text-3xl font-light text-black mb-5">{section.title}</h2>
                <div className="space-y-5 text-base md:text-lg text-gray-600 font-light leading-relaxed">
                  {section.paragraphs.map((paragraph, index) => <p key={index}><InlineCopy text={paragraph} /></p>)}
                </div>
              </section>
            ))}
            <nav aria-label="Production resources" className="border-t border-gray-200 pt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-black">
              <Link href="/services/" className="underline underline-offset-4 hover:opacity-60">Video production services</Link>
              <Link href="/fashion-film-production/" className="underline underline-offset-4 hover:opacity-60">Fashion film production</Link>
              <Link href="/fashion-film-production-cost/" className="underline underline-offset-4 hover:opacity-60">Fashion film production cost guide</Link>
            </nav>
          </div>
        </article>
        <section className="bg-black text-white py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-light mb-4">Ready to Create Something Amazing?</h2>
            <p className="text-gray-400 mb-6">Let&apos;s discuss your next project and bring your vision to life.</p>
            <Link href="/contact/" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 font-medium hover:bg-gray-100 transition-colors">
              Start a Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
