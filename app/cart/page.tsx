"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Minus, Plus, X } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  // Placeholder Stripe checkout URL - replace with real one when available
  const STRIPE_CHECKOUT_URL = "#stripe-checkout-placeholder";

  const handleCheckout = () => {
    if (items.length === 0) return;

    // When Stripe is set up, this will redirect to Stripe checkout
    // For now, show an alert
    alert("Stripe checkout coming soon! Contact Unitedstudiocollective@gmail.com to place an order.");
    // window.location.href = STRIPE_CHECKOUT_URL;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header variant="light" currentPage="Store" />

      <main className="flex-1 pt-[100px] md:pt-[130px] pb-16 px-4 md:px-8">
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
                  className="w-full bg-black text-white py-4 text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  Proceed to Checkout
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
