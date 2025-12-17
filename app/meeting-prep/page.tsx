"use client";

import Link from "next/link";
import { ArrowLeft, Check, Circle, Calendar, Target, Clock } from "lucide-react";

export default function MeetingPrep() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Meeting Prep</h1>
            <p className="text-sm text-gray-500">Evan &amp; Mike - December 17, 2025</p>
          </div>
          <Link
            href="/launch-checklist"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Launch Checklist
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Timeline Alert */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-orange-600" />
            <div>
              <p className="font-semibold text-orange-900">Film Release: Friday, December 19th</p>
              <p className="text-sm text-orange-700">2 days away!</p>
            </div>
          </div>
        </div>

        {/* Last Meeting Recap */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            Last Meeting Recap (Dec 10th, La Colombe)
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Evan&apos;s Goals</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li><strong>Short term:</strong> USC becomes premier brand for luxury boutique brands in LA</li>
                <li><strong>Long term:</strong> Branch to NYC/international, then expand beyond fashion into music videos and other commercial content</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">What Mike Offered</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>Recreate website off Wix (save $350-400/year)</li>
                <li>Host for free on GitHub Pages</li>
                <li>Add SEO pages to rank for specific searches</li>
                <li>Add auto-posting blog for SEO</li>
                <li>Set up Stripe for the store (cheaper than Wix)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Evan&apos;s Content Plan for Film Release</h3>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>BTS posts leading up to release</li>
                <li>Monday: Interview with Armand about favorite scene</li>
                <li>Wednesday (today): Post the Premiere timeline</li>
                <li>Friday Dec 19: Release film on YouTube, send to Becker&apos;s agency</li>
              </ul>
            </div>
          </div>
        </section>

        {/* What Got Done */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            What Got Done
          </h2>

          <div className="grid gap-2">
            {[
              "Website recreated in Next.js",
              "Deployed to GitHub Pages",
              "SEO optimizations (sitemap, meta tags, JSON-LD schemas)",
              "Store with 10 products",
              "Shopping cart with localStorage",
              "Launch checklist page",
              "Logo/text color fixed (now black)",
              "Images link to their pages",
              "Header size fixed",
              "Scrolling fixed on all pages",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Evan's Feedback */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Evan&apos;s Feedback (Still Needs Work)
          </h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Circle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Logo bolder/bigger</p>
                <p className="text-sm text-gray-600">Evan will provide the actual font used on Wix</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Circle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Update copyright to 2026</p>
                <p className="text-sm text-gray-600">Quick fix in footer</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Circle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Video auto-play decision</p>
                <p className="text-sm text-gray-600">Does Evan want the main video to auto-play on load?</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Circle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Video scroll arrow visibility</p>
                <p className="text-sm text-gray-600">Black arrow is hard to see, make more visible</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
              <Circle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Store frame options wrong</p>
                <p className="text-sm text-gray-600">Shows &quot;natural and dark wood&quot; but that&apos;s not what Evan sells. Need correct options.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Evan's Tasks */}
        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Evan&apos;s Tasks to Launch</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
              <div>
                <p className="font-medium text-blue-900">Transfer domain to Cloudflare</p>
                <p className="text-sm text-blue-700">Go to dash.cloudflare.com, add site, get nameservers, update at Wix</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
              <div>
                <p className="font-medium text-blue-900">Set up DNS records</p>
                <p className="text-sm text-blue-700">4 A records (185.199.108-111.153) + CNAME (www → banddude.github.io)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
              <div>
                <p className="font-medium text-blue-900">Configure custom domain in GitHub</p>
                <p className="text-sm text-blue-700">Add unitedstudiocollective.com in repo Settings → Pages</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">4</span>
              <div>
                <p className="font-medium text-blue-900">Create Stripe account</p>
                <p className="text-sm text-blue-700">Sign up at stripe.com, verify business</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">5</span>
              <div>
                <p className="font-medium text-blue-900">Create Stripe Payment Links</p>
                <p className="text-sm text-blue-700">One for each product variant (frameless, black frame, white frame)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">6</span>
              <div>
                <p className="font-medium text-blue-900">Provide the font</p>
                <p className="text-sm text-blue-700">The actual font used on Wix for the logo</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="https://banddude.github.io/united-studio-collective"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              Live Site →
            </a>
            <a
              href="https://github.com/banddude/united-studio-collective"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              GitHub Repo →
            </a>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              Cloudflare →
            </a>
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
            >
              Stripe →
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 mt-12 py-6 text-center text-sm text-gray-500">
        This page is only visible to you. Remove before final launch.
      </footer>
    </div>
  );
}
