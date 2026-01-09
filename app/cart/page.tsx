"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import { store, getProduct } from "../lib/store-data";

// Replace this with your actual Cloudflare Worker URL after deployment
const WORKER_URL = "https://usc-checkout.mikejshaffer.workers.dev";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const [loading, setLoading] = useState(false);

  const getStripeLink = (productId: number, frameOption: string, frameColor: string | undefined) => {
    if (!store.stripeEnabled) return null;
    const product = getProduct(productId);
    if (!product) return null;

    if (frameOption === "Frameless Photograph") return product.stripe.frameless;
    if (frameColor === "Black") return product.stripe.framed_black;
    if (frameColor === "White") return product.stripe.framed_white;
    return null;
  };

  const getStripePriceId = (productId: number, frameOption: string, frameColor: string | undefined) => {
    if (!store.stripeEnabled) return null;
    const product = getProduct(productId);
    if (!product) return null;

    if (frameOption === "Frameless Photograph") return product.stripe.frameless_price_id;
    if (frameColor === "Black") return product.stripe.framed_black_price_id;
    if (frameColor === "White") return product.stripe.framed_white_price_id;
    return null;
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!store.stripeEnabled) {
      alert("Checkout is currently disabled.");
      return;
    }

    // Single item fallback (if Worker isn't set up or fails, though we prefer Worker for all)
    if (items.length === 1 && !WORKER_URL) {
      const item = items[0];
      const link = getStripeLink(item.productId, item.frameOption, item.frameColor || undefined);
      if (link) {
        window.location.href = link;
        return;
      }
    }

    // Multi-item checkout via Cloudflare Worker
    setLoading(true);
    try {
      const checkoutItems = items.map(item => {
        const priceId = getStripePriceId(item.productId, item.frameOption, item.frameColor || undefined);
        if (!priceId) throw new Error(`Price ID missing for ${item.name}`);
        return {
          price: priceId,
          quantity: item.quantity
        };
      });

      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      });

      if (!response.ok) {
        throw new Error("Failed to start checkout");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }

    } catch (error) {
      console.error(error);
      alert("Checkout failed. Please try checking out items individually.");
    } finally {
      setLoading(false);
    }
  };

  const handleItemCheckout = (item: typeof items[0]) => {
    const link = getStripeLink(item.productId, item.frameOption, item.frameColor || undefined);
    if (link) {
      window.location.href = link;
    } else {
      alert("Checkout link not available.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header variant="light" currentPage="Store" />

      <main className="flex-1 pt-[120px] md:pt-[150px] pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-medium text-black mb-8">Your Cart</h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">Your cart is empty</p>
              <Link
                href="/store"
                className="inline-block bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.frameOption}-${item.frameColor}`}
                    className="flex gap-4 md:gap-6 border-b border-gray-200 pb-6"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm md:text-base font-medium text-black">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.frameOption}
                            {item.frameColor && ` - ${item.frameColor}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.frameOption, item.frameColor)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.frameOption,
                                item.frameColor,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-sm text-black bg-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.frameOption,
                                item.frameColor,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm md:text-base font-medium text-black">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Individual checkout fallback */}
                      {!WORKER_URL && store.stripeEnabled && items.length > 1 && (
                        <button
                          onClick={() => handleItemCheckout(item)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Checkout this item
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium text-black">
                    Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                  <span className="text-lg font-medium text-black">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                <Link
                  href="/store"
                  className="block text-center mt-4 text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
