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
- File location on Mike's computer: `/Users/mikeshaffer/Documents/Family/RACHEL/Box Chocolate/Box_Commercial/BoxChocolate_220225.mp4` (stuck in iCloud)

## Content Verification (Optional)

### 3. Video Descriptions
- Delikate Rayne Fashion Shoot: Only has creator name, no detailed description on Wix site
- Verify other video descriptions match exactly if needed

## Completed

- [x] Homepage with video background
- [x] Filmmaking page with video gallery/player
- [x] Photography page
- [x] Store with JSON-based product database
- [x] Shopping cart with localStorage persistence
- [x] Cart page with checkout ready for Stripe
- [x] About page (matches Wix)
- [x] Contact page with mailto form
- [x] 404 error page
- [x] Header with cart in nav (removed login button)
- [x] Footer with Instagram link and "Connect with us!" link
- [x] Mobile responsive design
- [x] Video search filter on filmmaking page
- [x] Video autoplay when navigating with arrows
- [x] Black background video player with info panel

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

Edit `public/config/store.json` and add a new entry to the `products` array:

```json
{
  "id": 11,
  "name": "New Product Name",
  "price": 85.00,
  "image": "https://url-to-product-image.jpg",
  "stripe": {
    "frameless": "",
    "framed_black": "",
    "framed_white": ""
  }
}
```

Then update `app/store/product/[id]/page.tsx` to include the new ID in `generateStaticParams()`.
