# United Studio Collective Site - TODO

## Waiting on Evan

### 1. Stripe Payment Links
- Create Stripe account at https://dashboard.stripe.com
- Go to Products > Payment Links
- Create Payment Links for each product variant:
  - Frameless ($85)
  - Framed Black ($85)
  - Framed White ($85)
- Edit `public/config/store.json`:
  - Set `"stripeEnabled": true`
  - Add Payment Link URLs for each product

### 2. Box Chocolate Video (Optional)
- Provide the video file to replace "Video coming soon" placeholder

## Completed

- [x] Homepage with full-screen images
- [x] Filmmaking page with video gallery/player
- [x] Photography page with lightbox
- [x] Store with JSON-based product database
- [x] Shopping cart with localStorage persistence
- [x] Cart page with checkout ready for Stripe
- [x] About page
- [x] Contact page with mailto form and validation
- [x] 404 error page
- [x] Header with cart in nav
- [x] Footer with Instagram link
- [x] Mobile responsive design
- [x] Video search filter on filmmaking page
- [x] SEO: sitemap, robots.txt, Open Graph, Twitter Cards, JSON-LD
- [x] Speed: compressed images/video, lazy loading, preconnect hints
- [x] Accessibility: ARIA labels, form validation
- [x] ESLint: all errors fixed
- [x] Static store data (build-time, no runtime fetches)
- [x] Admin panel for video management (drag-and-drop reordering, edit metadata, add/remove videos)
- [x] Google Search Console sitemap submission

## How to Enable Stripe Checkout

1. Edit `public/config/store.json`
2. Change `"stripeEnabled": false` to `"stripeEnabled": true`
3. For each product, add the Stripe Payment Link URLs:

```json
{
  "id": 1,
  "name": "An Evening With A Cherry Blossom Tree",
  "price": 85.00,
  "image": "...",
  "stripe": {
    "frameless": "https://buy.stripe.com/xxx",
    "framed_black": "https://buy.stripe.com/yyy",
    "framed_white": "https://buy.stripe.com/zzz"
  }
}
```

## How to Add New Products

1. Edit `public/config/store.json`
2. Add a new entry to the `products` array
3. The site will automatically pick up new products on next build (products are loaded at build time from the JSON)

## Video Management Admin Panel

A new admin panel has been created for managing the filmmaking page videos. Access it at `/admin/videos`

**Features:**
- Drag and drop to reorder videos
- Set hero video (first video shown)
- Edit titles, descriptions, duration, creator
- Add YouTube videos by URL
- Hide/show videos without deleting
- Delete videos
- Changes save directly to GitHub via API (triggers redeploy)

**Login required:**
1. Admin password: `usc2024` (default)
2. GitHub Personal Access Token (create at https://github.com/settings/tokens with repo scope)

The admin panel works entirely in the browser - no server setup needed. See `ADMIN.md` for detailed setup instructions.
