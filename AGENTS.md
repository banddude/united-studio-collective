# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

United Studio Collective website, a Next.js 16 static site deployed to GitHub Pages. This is a recreation of the original Wix site at www.unitedstudiocollective.com featuring filmmaking, photography, and an e-commerce store.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Build static export to ./out directory
npm run lint     # Run ESLint
```

Deployment happens automatically via GitHub Actions on push to main branch.

## Architecture

### Static Export Configuration
- `next.config.ts` sets `output: "export"` for static HTML generation
- `basePath: "/united-studio-collective"` is required for GitHub Pages subdirectory hosting
- All images use `unoptimized: true` since static export doesn't support image optimization

### Store Data (JSON-Driven)
Product data is centralized in `public/config/store.json`. This file serves as the database for:
- Product listings (id, name, price, image URL)
- Default artist/size/description
- Stripe Payment Link URLs (per product variant)
- `stripeEnabled` flag to activate checkout

To enable Stripe checkout: set `stripeEnabled: true` and populate the `stripe.frameless`, `stripe.framed_black`, `stripe.framed_white` URLs for each product.

### Cart System
- `app/context/CartContext.tsx` provides global cart state via React Context
- Cart persists to localStorage under key `usc-cart`
- Cart items include: productId, frameOption, frameColor, quantity

### Video Data
Filmmaking page videos are defined inline in `app/filmmaking/page.tsx`. Each video has:
- Platform type: `youtube`, `vimeo`, `local`, or `pending`
- Local videos served from `public/videos/`
- `basePath` prefix applied dynamically for local video paths in production

### Shared Components
- `app/components/Header.tsx` - Navigation with cart icon, mobile menu
- `app/components/Footer.tsx` - Site footer with Instagram link

## GitHub Pages Deployment

The site deploys to: `https://banddude.github.io/united-studio-collective/`

Key deployment considerations:
- All internal links must work with the `/united-studio-collective` basePath
- Local video/asset paths use dynamic basePath: `process.env.NODE_ENV === "production" ? "/united-studio-collective" : ""`
- Static params must be generated for dynamic routes (see `app/store/product/[id]/page.tsx`)
