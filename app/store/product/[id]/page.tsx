import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductClient from "./ProductClient";
import {
  getProducts,
  getProduct,
  getDefaultArtist,
  getDefaultSize,
  getDefaultDescription,
  isStripeEnabled,
} from "../../../lib/store-data";

const baseUrl = "https://unitedstudiocollective.com";

// Generate static params for all product IDs from the JSON
export function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    id: String(product.id),
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

// Dynamic metadata for each product
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(parseInt(id));

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const artist = product.artist || getDefaultArtist();
  const description = `${product.name} by ${artist}. Fine art photography print available framed or frameless. $${product.price.toFixed(2)} USD. Printed in Glendale, CA.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      url: `${baseUrl}/store/product/${product.id}`,
      images: [
        {
          url: product.image,
          width: 542,
          height: 542,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [product.image],
    },
    alternates: {
      canonical: `${baseUrl}/store/product/${product.id}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = parseInt(id);

  const products = getProducts();
  const product = getProduct(productId);

  if (!product) {
    notFound();
  }

  const currentIndex = products.findIndex((p) => p.id === productId);
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct = currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  const artist = product.artist || getDefaultArtist();
  const size = product.size || getDefaultSize();
  const description = product.description || getDefaultDescription();

  return (
    <ProductClient
      product={product}
      prevProduct={prevProduct}
      nextProduct={nextProduct}
      artist={artist}
      size={size}
      description={description}
      stripeEnabled={isStripeEnabled()}
    />
  );
}
