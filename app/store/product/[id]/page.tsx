import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import {
  getProducts,
  getProduct,
  getDefaultArtist,
  getDefaultSize,
  getDefaultDescription,
  isStripeEnabled,
} from "../../../lib/store-data";

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
