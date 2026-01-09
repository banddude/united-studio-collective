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

export interface StoreConfig {
  stripeEnabled: boolean;
  defaultArtist: string;
  defaultSize: string;
  defaultDescription: string;
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
