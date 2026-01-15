import { Metadata } from "next";

const baseUrl = "https://unitedstudiocollective.com";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Connect with United Studio Collective for your video production and photography needs. Based in Los Angeles, CA. Email: Unitedstudiocollective@gmail.com",
  openGraph: {
    title: "Contact Us | United Studio Collective",
    description: "Connect with United Studio Collective for your video production and photography needs.",
    url: `${baseUrl}/contact`,
    images: [
      {
        url: `${baseUrl}/images/contact/observatory.jpg`,
        width: 387,
        height: 476,
        alt: "Contact United Studio Collective",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | United Studio Collective",
    description: "Connect with United Studio Collective for your video production and photography needs.",
  },
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
};
