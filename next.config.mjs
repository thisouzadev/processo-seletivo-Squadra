/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  newNextLinkBehavior: true,
  images: {
    domains: ['raw.githubusercontent.com/'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
