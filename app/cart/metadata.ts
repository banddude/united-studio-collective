import { Metadata } from "next";

const baseUrl = "https://banddude.github.io/united-studio-collective";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your shopping cart at United Studio Collective. Photography prints and artwork ready for checkout.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: `${baseUrl}/cart`,
  },
};
