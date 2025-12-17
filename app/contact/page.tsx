"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent("Contact from United Studio Collective Website");
    const body = encodeURIComponent(
      `Name: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:Unitedstudiocollective@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header variant="light" currentPage="Contact" />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-[120px] md:pt-[150px] pb-16 px-4">
        {/* Contact Card with Background Image */}
        <div className="relative w-full max-w-sm overflow-hidden">
          {/* Background Image - Griffith Observatory */}
          <div className="absolute inset-0">
            <Image
              src="https://static.wixstatic.com/media/963954_d814f2bf9d9b42778edad54cad7816ce~mv2.jpg/v1/fill/w_387,h_476,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Sunset%20Observatory.jpg"
              alt="Griffith Observatory"
              fill
              className="object-cover"
            />
            {/* Dark overlay for top portion */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#4a5568]/90 via-[#4a5568]/80 to-transparent" />
          </div>

          {/* Form Content */}
          <div className="relative z-10 p-6 pb-8">
            {/* Heading */}
            <h2 className="text-base font-light text-white text-center mb-5">
              Connect with us on future projects
            </h2>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Row 1: First Name and Last Name */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b border-gray-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b border-gray-400 focus:outline-none"
                />
              </div>

              {/* Row 2: Email and Phone */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b border-gray-400 focus:outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b border-gray-400 focus:outline-none"
                />
              </div>

              {/* Row 3: Message Textarea */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b border-gray-400 focus:outline-none resize-none"
              />

              {/* Submit Button */}
              <div className="flex justify-center pt-3">
                <button
                  type="submit"
                  className="px-10 py-2 bg-black text-white text-xs font-medium hover:bg-gray-900 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>

            {/* Spacer for observatory image to show */}
            <div className="h-24" />

            {/* Email Link */}
            <div className="text-center">
              <a
                href="mailto:Unitedstudiocollective@gmail.com"
                className="text-white/90 hover:text-white transition-colors text-xs"
              >
                Unitedstudiocollective@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
