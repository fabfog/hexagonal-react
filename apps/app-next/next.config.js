/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Temporarily ignore ESLint during builds (using flat config in development)
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@repo/ui",
    "@repo/domain",
    "@repo/ports",
    "@repo/use-cases",
    "@repo/adapter-viewmodels",
    "@repo/adapter-demo",
  ],
};

module.exports = nextConfig;
