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
        url: "https://static.wixstatic.com/media/963954_d814f2bf9d9b42778edad54cad7816ce~mv2.jpg",
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
