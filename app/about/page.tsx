"use client";

import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header variant="light" currentPage="About" />

      {/* Main Content */}
      <main className="pt-[120px] md:pt-[150px] pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        {/* What We Strive For Section */}
        <section className="mb-10">
          <h2
            className="text-[22px] text-center mb-6 italic font-normal text-black"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            What We Strive For
          </h2>
          <p className="text-[15px] leading-relaxed text-black text-justify">
            United Studio Collective is a gateway to creative expression. Our mission is to use a diverse range of specialty artists and transform the everyday into something different and exquisite. We specialize in producing fashion films, experimental short films, and delving into the timeless worlds of analog and digital photography. Our team of talented creative individuals is continuously growing, so come and join us on this exciting adventure of visual storytelling.
          </p>
        </section>

        {/* Team Photo - B&W silhouette at window */}
        <section className="mb-14 flex justify-center">
          <div className="relative w-80 h-80">
            <Image
              src="https://static.wixstatic.com/media/963954_7c1e5fa77e944f5ba66f2a5032bf3801~mv2.jpg/v1/fill/w_509,h_501,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/20210420-000070410011.jpg"
              alt="United Studio Collective Team"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </section>

        {/* Evan Rene Section */}
        <section className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3
                className="text-xl italic mb-4 font-normal text-black"
                style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
              >
                Evan Rene
              </h3>
              <p className="text-sm leading-relaxed text-black text-justify">
                How do we expand upon the standard? That is the constant question that lingers in Evan Rene&apos;s mind! Film is a creative medium that has thrived in pop culture. Amazing trends have started and bad trends have come from it. Evan&apos;s goal isn&apos;t to completely revitalize the film industry or even bring it back to its former self. Evan&apos;s goal is to make art count and to tell compelling thought-provoking stories through filmmaking &amp; photography.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative w-64 h-72">
                <Image
                  src="https://static.wixstatic.com/media/963954_3739d7b048214741981aa5eae48a6f96~mv2.jpg/v1/fill/w_334,h_219,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG-7156_JPG.jpg"
                  alt="Evan Rene"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Katie Chew Section */}
        <section className="mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3
                className="text-xl italic mb-4 font-normal text-black"
                style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
              >
                Katie Chew
              </h3>
              <p className="text-sm leading-relaxed text-black text-justify">
                Katie is a fashion photographer from the Midwest who moved to Los Angeles to achieve her dreams of working with other creatives in fashion. She is a skilled photographer who gets her inspiration from movies and current high fashion magazines she carefully studies. She enjoys working with everyone as a collective effort and believes the best ideas come from working with others.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="relative w-40 h-52">
                <Image
                  src="https://static.wixstatic.com/media/2e5994_ee9ab9817e874646a6eefb52054c52a8~mv2.png/v1/fill/w_173,h_219,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/240308_KatieChew.png"
                  alt="Katie Chew"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Fashion Brands Section */}
        <section className="mb-8">
          <h2
            className="text-xl italic text-center mb-8 font-normal text-black"
            style={{ fontFamily: "'Times New Roman', Georgia, serif" }}
          >
            Fashion Brands
          </h2>
          <div className="flex justify-center items-center gap-8">
            {/* Delikate Rayne */}
            <a
              href="https://www.delikaterayne.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://static.wixstatic.com/media/2e5994_36156a83ac494955b732c2f50cc4eb1e~mv2.webp"
                alt="DELIKATE RAYNE"
                className="h-40 w-auto object-contain"
              />
            </a>

            {/* Simon */}
            <a
              href="https://www.instagram.com/simon_haiku/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://static.wixstatic.com/media/2e5994_9cb24cbadb4d4e8a9626ce6fea72ba64~mv2.jpg"
                alt="SIMON"
                className="h-40 w-auto object-contain"
              />
            </a>

            {/* Hellstar */}
            <a
              href="https://hellstar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://static.wixstatic.com/media/2e5994_2a6403cb4e214bc396346c4dfe2dd315~mv2.webp"
                alt="Hellstar"
                className="h-40 w-auto object-contain"
              />
            </a>
          </div>
          <div className="text-center text-xs text-gray-400 mt-4">1/1</div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
