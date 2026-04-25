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
  /**
   * When true, the product is archived: not for sale through the store, but
   * still discoverable on /store/archive. Visitors are asked to contact USC
   * directly for purchase.
   */
  archived?: boolean;
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
  archivedNotice?: string;
  featuredArtist: FeaturedArtist;
  products: Product[];
}

export const store: StoreConfig = storeConfig as StoreConfig;

const DEFAULT_ARCHIVED_NOTICE =
  "Photo no longer available for sale, please contact United Studio Collective directly for purchase.";

/**
 * Active products only. This is the default for shop pages.
 */
export function getProducts(): Product[] {
  return store.products.filter((p) => !p.archived);
}

/**
 * Every product, including archived. Use for static params and full lookups.
 */
export function getAllProducts(): Product[] {
  return store.products;
}

/**
 * Products that have been archived (still visible on /store/archive).
 */
export function getArchivedProducts(): Product[] {
  return store.products.filter((p) => p.archived);
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

export function getArchivedNotice(): string {
  return store.archivedNotice || DEFAULT_ARCHIVED_NOTICE;
}

export function getFeaturedArtist(): FeaturedArtist {
  return store.featuredArtist;
}

/**
 * All artists across all products, including archive-only artists. Used for
 * static params so deep links to past artists still render.
 */
export function getAllArtists(): string[] {
  const artists = new Set<string>();
  store.products.forEach((p) => {
    artists.add(p.artist || store.defaultArtist);
  });
  return Array.from(artists);
}

/**
 * All artists across active products. Excludes artists that only show up on
 * archived prints, since those are surfaced separately via the archive view.
 */
export function getArtists(): string[] {
  const artists = new Set<string>();
  store.products.forEach((p) => {
    if (p.archived) return;
    artists.add(p.artist || store.defaultArtist);
  });
  return Array.from(artists);
}

// Get artists excluding the default artist (Evan), and excluding archive-only artists
export function getDisplayArtists(): string[] {
  const artists = new Set<string>();
  store.products.forEach((p) => {
    if (p.archived) return;
    if (p.artist && p.artist !== store.defaultArtist) {
      artists.add(p.artist);
    }
  });
  return Array.from(artists);
}

export function getProductsByArtist(artist: string): Product[] {
  return store.products.filter((p) => {
    if (p.archived) return false;
    const productArtist = p.artist || store.defaultArtist;
    return productArtist === artist;
  });
}

export function getArchivedProductsByArtist(artist: string): Product[] {
  return store.products.filter((p) => {
    if (!p.archived) return false;
    const productArtist = p.artist || store.defaultArtist;
    return productArtist === artist;
  });
}

export function artistToSlug(artist: string): string {
  return artist.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function slugToArtist(slug: string): string | undefined {
  // Look across both active and archived artists so /store/artist/<slug>
  // continues to resolve for archived collections (returns empty list, with
  // a notice).
  const artists = new Set<string>();
  store.products.forEach((p) => {
    artists.add(p.artist || store.defaultArtist);
  });
  return Array.from(artists).find((a) => artistToSlug(a) === slug);
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
