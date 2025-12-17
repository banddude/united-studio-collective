"use client";

import Link from "next/link";
import { ArrowLeft, Check, Circle, Calendar, Clock, ExternalLink } from "lucide-react";

export default function MeetingPrep() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-zinc-900/50 via-transparent to-zinc-900/30 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-sm bg-black/20">
          <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 mb-1">Meeting Prep</p>
              <h1 className="text-2xl font-light tracking-tight">Evan &amp; Mike</h1>
              <p className="text-sm text-zinc-500 mt-1">December 17, 2025</p>
            </div>
            <Link
              href="/launch-checklist"
              className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Checklist
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
          {/* Film Release Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
            <div className="relative p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-7 h-7 text-black" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-amber-400/80 mb-1">Film Release</p>
                <p className="text-2xl font-light">Friday, December 19th</p>
                <p className="text-amber-400/60 mt-1">2 days away</p>
              </div>
            </div>
          </div>

          {/* Last Meeting Recap */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center">
                <Clock className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-light">Last Meeting</h2>
                <p className="text-sm text-zinc-500">December 10th, La Colombe</p>
              </div>
            </div>

            <div className="grid gap-6">
              {/* Evan's Goals */}
              <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-4">Evan&apos;s Goals</h3>
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <span className="text-zinc-600 text-sm w-20 flex-shrink-0">Short term</span>
                    <p className="text-zinc-300 text-sm">USC becomes premier brand for luxury boutique brands in LA</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-zinc-600 text-sm w-20 flex-shrink-0">Long term</span>
                    <p className="text-zinc-300 text-sm">Branch to NYC/international, expand beyond fashion into music videos and commercial content</p>
                  </div>
                </div>
              </div>

              {/* Content Plan */}
              <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-6">
                <h3 className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-4">Content Plan for Film Release</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-zinc-600" />
                    <p className="text-zinc-400 text-sm">BTS posts leading up to release</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-zinc-600" />
                    <p className="text-zinc-400 text-sm">Monday: Interview with Armand about favorite scene</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-white text-sm">Wednesday (today): Post the Premiere timeline</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-zinc-400 text-sm">Friday Dec 19: Release on YouTube, send to agencies</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What Got Done */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-light">Completed</h2>
            </div>

            <div className="bg-zinc-900/50 rounded-xl border border-white/5 p-6">
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  "Website recreated in Next.js",
                  "Deployed to GitHub Pages",
                  "SEO optimizations",
                  "Store with 10 products",
                  "Shopping cart",
                  "Launch checklist page",
                  "Logo/text color fixed",
                  "Images link to pages",
                  "Header size fixed",
                  "Scrolling fixed",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-emerald-500/60 flex-shrink-0" />
                    <span className="text-zinc-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Needs Work */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Circle className="w-5 h-5 text-amber-400" />
              </div>
              <h2 className="text-lg font-light">Needs Work</h2>
            </div>

            <div className="space-y-3">
              {[
                { title: "Logo bolder/bigger", note: "Evan will provide the font" },
                { title: "Update copyright to 2026", note: "Quick footer fix" },
                { title: "Video auto-play?", note: "Need Evan's decision" },
                { title: "Video scroll arrow", note: "Hard to see, make more visible" },
                { title: "Store frame options", note: "Wrong options showing" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white text-sm">{item.title}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.note}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                </div>
              ))}
            </div>
          </section>

          {/* Evan's Tasks */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <span className="text-blue-400 font-medium">E</span>
              </div>
              <h2 className="text-lg font-light">Evan&apos;s Tasks to Launch</h2>
            </div>

            <div className="space-y-3">
              {[
                { step: 1, title: "Transfer domain to Cloudflare", desc: "Add site, get nameservers, update at Wix" },
                { step: 2, title: "Set up DNS records", desc: "4 A records + CNAME for www" },
                { step: 3, title: "Configure custom domain", desc: "Add domain in GitHub Pages settings" },
                { step: 4, title: "Create Stripe account", desc: "Sign up and verify business" },
                { step: 5, title: "Create Payment Links", desc: "One per product variant" },
                { step: 6, title: "Provide the font", desc: "The logo font from Wix" },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-zinc-900/50 rounded-xl border border-white/5 p-4 flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm text-zinc-400 flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <p className="text-white text-sm">{item.title}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links */}
          <section>
            <h2 className="text-xs uppercase tracking-[0.15em] text-zinc-500 mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Live Site", href: "https://banddude.github.io/united-studio-collective" },
                { label: "GitHub", href: "https://github.com/banddude/united-studio-collective" },
                { label: "Cloudflare", href: "https://dash.cloudflare.com" },
                { label: "Stripe", href: "https://dashboard.stripe.com" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-zinc-900/50 rounded-xl border border-white/5 p-4 hover:bg-zinc-800/50 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{link.label}</span>
                    <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 text-center">
          <p className="text-xs text-zinc-600">Internal use only</p>
        </footer>
      </div>
    </div>
  );
}
