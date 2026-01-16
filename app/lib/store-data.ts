// Store data imported at build time
import storeConfig from "../../public/config/store.json";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  artist?: string;
  size?: string;
  description?: string;
  stripe: {
    frameless: string;
    frameless_price_id?: string;
    framed_black: string;
    framed_black_price_id?: string;
    framed_white: string;
    framed_white_price_id?: string;
  };
}

export interface FeaturedArtist {
  name: string;
  tagline: string;
  description: string;
  image: string;
}

export interface StoreConfig {
  stripeEnabled: boolean;
  defaultArtist: string;
  defaultSize: string;
  defaultDescription: string;
  featuredArtist: FeaturedArtist;
  products: Product[];
}

export const store: StoreConfig = storeConfig as StoreConfig;

export function getProducts(): Product[] {
  return store.products;
}

export function getProduct(id: number): Product | undefined {
  return store.products.find((p) => p.id === id);
}

export function isStripeEnabled(): boolean {
  return store.stripeEnabled;
}

export function getDefaultArtist(): string {
  return store.defaultArtist;
}

export function getDefaultSize(): string {
  return store.defaultSize;
}

export function getDefaultDescription(): string {
  return store.defaultDescription;
}

export function getFeaturedArtist(): FeaturedArtist {
  return store.featuredArtist;
}

export function getArtists(): string[] {
  const artists = new Set<string>();
  store.products.forEach((p) => {
    artists.add(p.artist || store.defaultArtist);
  });
  return Array.from(artists);
}

// Get artists excluding the default artist (Evan)
export function getDisplayArtists(): string[] {
  const artists = new Set<string>();
  store.products.forEach((p) => {
    if (p.artist && p.artist !== store.defaultArtist) {
      artists.add(p.artist);
    }
  });
  return Array.from(artists);
}

export function getProductsByArtist(artist: string): Product[] {
  return store.products.filter((p) => {
    const productArtist = p.artist || store.defaultArtist;
    return productArtist === artist;
  });
}

export function artistToSlug(artist: string): string {
  return artist.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function slugToArtist(slug: string): string | undefined {
  const artists = getArtists();
  return artists.find(a => artistToSlug(a) === slug);
}

// Convert image path to thumbnail path
export function getThumbPath(imagePath: string): string {
  // /images/store/image.jpg -> /images/store/thumbs/image.jpg
  const parts = imagePath.split('/');
  const filename = parts.pop();
  return [...parts, 'thumbs', filename].join('/');
}

// Convert any image path to thumbnail path (generic version)
export function toThumbPath(imagePath: string): string {
  const parts = imagePath.split('/');
  const filename = parts.pop();
  return [...parts, 'thumbs', filename].join('/');
}
