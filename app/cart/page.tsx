"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Minus, Plus, X, Loader2, MapPin, Check } from "lucide-react";
import { store, getProduct } from "../lib/store-data";

// Replace this with your actual Cloudflare Worker URL after deployment
const WORKER_URL = "https://usc-checkout.mikejshaffer.workers.dev";

interface ShippingRate {
  id: string;
  provider: string;
  service: string;
  price: number;
  days: number;
  description: string;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("US");
  const [loadingRates, setLoadingRates] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[] | null>(null);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [ratesError, setRatesError] = useState<string | null>(null);

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

    if (!selectedRate) {
      alert("Please select a shipping method.");
      return;
    }

    setLoading(true);
    try {
      const checkoutItems = items.map(item => {
        const priceId = getStripePriceId(item.productId, item.frameOption, item.frameColor || undefined);
        if (!priceId) throw new Error(`Price ID missing for ${item.name}`);
        return {
          priceId: priceId,
          quantity: item.quantity
        };
      });

      const response = await fetch(`${WORKER_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems,
          shippingCost: selectedRate.price,
          shippingService: selectedRate.service,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to start checkout");
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(error);
      alert(message || "Checkout failed. Please try again.");
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

  const fetchShippingRates = async () => {
    if (!zipCode || zipCode.length < 3) {
      setRatesError("Please enter a valid postal code");
      return;
    }

    setLoadingRates(true);
    setRatesError(null);
    setShippingRates(null);
    setSelectedRate(null);

    try {
      const checkoutItems = items.map(item => {
        const priceId = getStripePriceId(item.productId, item.frameOption, item.frameColor || undefined);
        if (!priceId) throw new Error(`Price ID missing for ${item.name}`);
        const isFramed = item.frameOption !== "Frameless Photograph";
        return { price: priceId, quantity: item.quantity, isFramed };
      });

      const response = await fetch(`${WORKER_URL}/rates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems,
          zipCode: zipCode,
          country: country,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch shipping rates");
      }

      const data = await response.json();
      setShippingRates(data.rates);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setRatesError(message || "Failed to load shipping rates");
    } finally {
      setLoadingRates(false);
    }
  };

  const finalTotal = totalPrice + (selectedRate?.price || 0);

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
                {/* Shipping Calculator */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-2">
                    Calculate shipping
                  </label>
                  {/* TODO: Could fetch country list from Shippo API instead of hardcoding */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setShippingRates(null);
                        setSelectedRate(null);
                      }}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-black"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="MX">Mexico</option>
                      <option value="GB">United Kingdom</option>
                      <option value="IE">Ireland</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="NL">Netherlands</option>
                      <option value="BE">Belgium</option>
                      <option value="AT">Austria</option>
                      <option value="CH">Switzerland</option>
                      <option value="SE">Sweden</option>
                      <option value="NO">Norway</option>
                      <option value="DK">Denmark</option>
                      <option value="FI">Finland</option>
                      <option value="PL">Poland</option>
                      <option value="PT">Portugal</option>
                      <option value="AU">Australia</option>
                      <option value="NZ">New Zealand</option>
                      <option value="JP">Japan</option>
                      <option value="KR">South Korea</option>
                      <option value="SG">Singapore</option>
                      <option value="HK">Hong Kong</option>
                      <option value="IL">Israel</option>
                      <option value="BR">Brazil</option>
                      <option value="AR">Argentina</option>
                      <option value="CL">Chile</option>
                    </select>
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.slice(0, 10))}
                        placeholder={country === "US" ? "ZIP code" : "Postal code"}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none bg-white text-black"
                        onKeyPress={(e) => e.key === "Enter" && fetchShippingRates()}
                      />
                    </div>
                    <button
                      onClick={fetchShippingRates}
                      disabled={loadingRates || zipCode.length < 3}
                      className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm whitespace-nowrap"
                    >
                      {loadingRates ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin w-4 h-4" />
                          Loading...
                        </span>
                      ) : (
                        "Get Rates"
                      )}
                    </button>
                  </div>
                  {ratesError && (
                    <p className="mt-2 text-sm text-red-600">{ratesError}</p>
                  )}
                </div>

                {/* Shipping Rates */}
                {shippingRates && shippingRates.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-black mb-3">Select shipping method</h3>
                    <div className="space-y-2">
                      {shippingRates.map((rate) => (
                        <button
                          key={rate.id}
                          onClick={() => setSelectedRate(rate)}
                          className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                            selectedRate?.id === rate.id
                              ? "border-black bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedRate?.id === rate.id ? "border-black bg-black" : "border-gray-300"
                            }`}>
                              {selectedRate?.id === rate.id && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-medium text-black">{rate.service}</p>
                              <p className="text-xs text-gray-500">{rate.provider} • {rate.days ? `${rate.days} business days` : "5-7 business days"}</p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-black">${rate.price.toFixed(2)}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black">
                      Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium text-black">${totalPrice.toFixed(2)}</span>
                  </div>
                  {selectedRate && (
                    <div className="flex justify-between items-center">
                      <span className="text-black">Shipping</span>
                      <span className="font-medium text-black">${selectedRate.price.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-black">Tax</span>
                    <span className="text-sm text-gray-500">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-medium text-black">Total</span>
                    <span className="text-lg font-medium text-black">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {!selectedRate && !shippingRates && (
                  <p className="text-sm text-gray-500 mb-6">
                    Enter your postal code above to see shipping rates
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading || !selectedRate}
                  className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
