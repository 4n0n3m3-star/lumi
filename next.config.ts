import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/book', destination: '/book.html' },
      { source: '/artists', destination: '/artists.html' },
    ];
  },
};

export default nextConfig;
