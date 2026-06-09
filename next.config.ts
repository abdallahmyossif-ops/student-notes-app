import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // If the BACKEND_URL environment variable is set (it will be on the frontend container),
    // forward all /api/... requests to the backend container instead of handling them locally.
    if (process.env.BACKEND_URL) {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.BACKEND_URL}/api/:path*`,
        },
      ];
    }
    // If BACKEND_URL is not set, handle API routes locally (for local development)
    return [];
  },
};

export default nextConfig;
