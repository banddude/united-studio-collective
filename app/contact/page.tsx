"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      message: true,
    });

    if (!validateForm()) {
      return;
    }

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
              alt="Griffith Observatory at sunset"
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
            <form onSubmit={handleSubmit} className="space-y-2" noValidate aria-label="Contact form">
              {/* Row 1: First Name and Last Name */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="First Name *"
                    aria-required="true"
                    aria-invalid={touched.firstName && !!errors.firstName}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    className={`w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b focus:outline-none ${
                      touched.firstName && errors.firstName ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                  {touched.firstName && errors.firstName && (
                    <p id="firstName-error" className="text-red-400 text-[10px] mt-1" role="alert">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Last Name *"
                    aria-required="true"
                    aria-invalid={touched.lastName && !!errors.lastName}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    className={`w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b focus:outline-none ${
                      touched.lastName && errors.lastName ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                  {touched.lastName && errors.lastName && (
                    <p id="lastName-error" className="text-red-400 text-[10px] mt-1" role="alert">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Row 2: Email and Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Email *"
                    aria-required="true"
                    aria-invalid={touched.email && !!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b focus:outline-none ${
                      touched.email && errors.email ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p id="email-error" className="text-red-400 text-[10px] mt-1" role="alert">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="phone" className="sr-only">Phone (optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b border-gray-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Message Textarea */}
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Type your message here... *"
                  rows={4}
                  aria-required="true"
                  aria-invalid={touched.message && !!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`w-full px-3 py-2 text-xs bg-[#d1d5db] text-gray-700 placeholder-gray-500 border-b focus:outline-none resize-none ${
                    touched.message && errors.message ? "border-red-500" : "border-gray-400"
                  }`}
                />
                {touched.message && errors.message && (
                  <p id="message-error" className="text-red-400 text-[10px] mt-1" role="alert">{errors.message}</p>
                )}
              </div>

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
                aria-label="Send email to United Studio Collective"
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
