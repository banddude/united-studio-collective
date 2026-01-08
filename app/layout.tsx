import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import ImageProtection from "./components/ImageProtection";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const baseUrl = "https://banddude.github.io/united-studio-collective";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "United Studio Collective | Los Angeles Video Production Company",
    template: "%s | United Studio Collective",
  },
  description: "Los Angeles based video production company specializing in filmmaking, photography, and creative content. Fashion films, experimental shorts, and analog/digital photography.",
  keywords: ["video production", "Los Angeles", "filmmaking", "photography", "fashion films", "LA video production", "creative content", "United Studio Collective"],
  authors: [{ name: "United Studio Collective" }],
  creator: "United Studio Collective",
  publisher: "United Studio Collective",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "United Studio Collective",
    title: "United Studio Collective | Los Angeles Video Production",
    description: "Los Angeles based video production company specializing in filmmaking, photography, and creative content.",
    images: [
      {
        url: `${baseUrl}/image_4.jpg`,
        width: 1200,
        height: 630,
        alt: "United Studio Collective",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "United Studio Collective | Los Angeles Video Production",
    description: "Los Angeles based video production company specializing in filmmaking, photography, and creative content.",
    images: [`${baseUrl}/image_4.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  verification: {
    google: "_DXuSIKqFsKW9CDfQ2Eix8H37HD_2wEmJbOoR3agvtU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://static.wixstatic.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "United Studio Collective",
              url: baseUrl,
              logo: `${baseUrl}/logo.png`,
              description: "Los Angeles based video production company specializing in filmmaking, photography, and creative content.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Los Angeles",
                addressRegion: "CA",
                addressCountry: "US",
              },
              sameAs: [
                "https://www.instagram.com/unitedstudiocollective",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "Unitedstudiocollective@gmail.com",
                contactType: "customer service",
              },
            }),
          }}
        />
        {/* LocalBusiness Schema for local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": `${baseUrl}/#localbusiness`,
              name: "United Studio Collective",
              image: `${baseUrl}/logo.png`,
              url: baseUrl,
              description: "Los Angeles video production company specializing in fashion films, experimental shorts, analog and digital photography.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Los Angeles",
                addressRegion: "CA",
                addressCountry: "US",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 34.0522,
                longitude: -118.2437,
              },
              areaServed: [
                {
                  "@type": "City",
                  name: "Los Angeles",
                },
                {
                  "@type": "State",
                  name: "California",
                },
              ],
              priceRange: "$$",
              email: "Unitedstudiocollective@gmail.com",
              sameAs: [
                "https://www.instagram.com/unitedstudiocollective",
              ],
              knowsAbout: [
                "Video Production",
                "Fashion Films",
                "Photography",
                "Filmmaking",
                "Creative Content",
                "Experimental Films",
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <CartProvider>
          <ImageProtection />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
