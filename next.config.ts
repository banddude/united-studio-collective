import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/united-studio-collective",
  assetPrefix: "/united-studio-collective",
  images: {
    unoptimized: true, // Required for static export - optimize images manually instead
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
