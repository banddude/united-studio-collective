# Speed Optimizations for United Studio Collective

## HIGH PRIORITY (Biggest Impact)

| # | Optimization | Issue | Fix |
|---|--------------|-------|-----|
| 1 | **Enable image optimization** | `unoptimized: true` disables Next.js optimization | Remove from next.config.ts |
| 2 | **Compress large images** | homepage-full.png (16MB), image_3.jpg (5MB), etc. ~35MB total | Compress to <500KB each |
| 3 | **Remove quality={100}** | Homepage forces max quality | Remove or set to 75-85 |
| 4 | **Delete unused fonts** | custom_font.ttf/woff/woff2 (274KB) unused | Delete files from public/fonts |

## MEDIUM PRIORITY

| # | Optimization | Issue | Fix |
|---|--------------|-------|-----|
| 5 | **Lazy load gallery** | Photography page loads all 23 images at once | Add lazy loading |
| 6 | **Dynamic imports** | Heavy components load immediately | Use next/dynamic for video player, cart |
| 7 | **Compress video** | light-dark.mp4 is 27MB | Compress or use streaming |

## LOW PRIORITY

| # | Optimization | Issue | Fix |
|---|--------------|-------|-----|
| 8 | **Add blur placeholders** | No loading placeholders | Add blurDataURL to images |
| 9 | **Preconnect to CDNs** | No hints for external domains | Add preconnect links for static.wixstatic.com, img.youtube.com |

## Current Stats

- **Total image size in /public:** ~35MB
- **Video file:** 27MB (light-dark.mp4)
- **Unused fonts:** 274KB
- **Bundle size:** ~1MB (good)

## Estimated Impact

If HIGH PRIORITY items are implemented:
- Initial page load: **~20MB to ~2-3MB** (85% reduction)
- Time to Interactive: **~8s to ~1-2s** (75% faster)
- Lighthouse Performance Score: **~40 to ~85+**

## Implementation Notes

### 1. Enable Image Optimization
Edit `next.config.ts` and remove the `unoptimized: true` line from images config.

**Note:** This requires external images to be in `remotePatterns`. Add:
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'static.wixstatic.com' },
    { protocol: 'https', hostname: 'img.youtube.com' },
  ],
},
```

### 2. Compress Images
Use a tool like ImageOptim, Squoosh, or TinyPNG to compress:
- `public/homepage-full.png` (16MB -> target <1MB)
- `public/image_3.jpg` (5MB -> target <500KB)
- `public/image_5.jpg` (2.9MB -> target <500KB)
- Other large images in public folder

### 3. Remove quality={100}
In `app/page.tsx`, remove `quality={100}` prop or change to `quality={80}`.

### 4. Delete Unused Fonts
```bash
rm public/fonts/custom_font.ttf
rm public/fonts/custom_font.woff
rm public/fonts/custom_font.woff2
```
