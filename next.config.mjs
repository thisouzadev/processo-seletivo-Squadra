/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  newNextLinkBehavior: true,
  images: {
    domains: ['raw.githubusercontent.com/'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
}

export default nextConfig
