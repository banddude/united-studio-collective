# Speed Optimizations for United Studio Collective

**Estimated Performance Score: ~75-85/100**

## Completed

| # | Optimization | Status |
|---|--------------|--------|
| 1 | Compress large images | ✅ Done (~35MB to ~6.6MB total) |
| 2 | Compress video | ✅ Done (27MB to 10MB) |
| 3 | Remove quality={100} | ✅ Done (changed to quality={80}) |
| 4 | Delete unused fonts | ✅ Done |
| 5 | Lazy load gallery | ✅ Done (first 6 eager, rest lazy) |
| 6 | Preconnect to CDNs | ✅ Done |
| 7 | Delete unused screenshots | ✅ Done (~33MB removed) |
| 8 | Static store data | ✅ Done (no runtime JSON fetches) |

## Current Stats

- **Total image size in /public:** ~6.6MB (was ~35MB)
- **Video file:** 10MB (was 27MB)
- **Bundle size:** ~1MB (good)

## File Sizes After Optimization

| File | Size |
|------|------|
| homepage-full.jpg | 3.2MB |
| image_3.jpg | 1.5MB |
| image_5.jpg | 664KB |
| image_1.jpg | 532KB |
| image_2.jpg | 516KB |
| image_4.jpg | 208KB |
| logo.png | 24KB |
| light-dark.mp4 | 10MB |

## What's Implemented

- Images compressed using sips (macOS)
- Video compressed using ffmpeg
- Photography gallery uses lazy loading (first 6 images load immediately)
- Preconnect hints for static.wixstatic.com and img.youtube.com
- Store data loaded at build time, not runtime
- Removed ~33MB of unused screenshot files

## Future Improvements (Optional)

- Enable Next.js image optimization (requires server, not compatible with static export)
- Add blur placeholders (blurDataURL) for better perceived performance
- Use dynamic imports for heavy components (video player)
- Further compress homepage-full.jpg if needed
