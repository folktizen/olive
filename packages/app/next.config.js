/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.resolve.fallback = { "pino-pretty": false, lokijs: false }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    })

    return config
  },
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**" // Allow all hostnames
      },
      {
        protocol: "http",
        hostname: "**" // Allow all hostnames
      }
    ]
  },
  async redirects() {
    return [
      {
        source: "/stacks/:path*",
        destination: "/farms/:path*",
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
