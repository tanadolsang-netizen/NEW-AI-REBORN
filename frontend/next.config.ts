import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  async rewrites() {
    return [
      { source: "/ready", destination: "http://127.0.0.1:8000/ready" },
      { source: "/api/:path*", destination: "http://127.0.0.1:8000/v1/:path*" },
    ];
  },
};

export default nextConfig;
