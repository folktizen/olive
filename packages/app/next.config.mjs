import bundleAnalyzer from "@next/bundle-analyzer"
import { withMinifyClassnames } from "nextjs-plugin-minify-css-classname"

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
    webpackBuildWorker: true,
    webVitalsAttribution: ["FCP", "LCP", "CLS", "FID", "TTFB", "INP"],
    optimizePackageImports: ["tailwindcss"]
  },
  webpack(config) {
    config.resolve.fallback = { "pino-pretty": false, lokijs: false }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    })
    config.module.exprContextCritical = false
    return config
  },
  images: {
    unoptimized: true
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  async rewrites() {
    return [
      {
        source: "/api/script.js",
        destination: "https://app.rybbit.io/api/script.js"
      },
      {
        source: "/api/track",
        destination: "https://app.rybbit.io/api/track"
      }
    ]
  }
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.BUILD_ANALYZE === "true"
})

function getExportedConfig() {
  return withMinifyClassnames(withBundleAnalyzer(nextConfig))
}

export default getExportedConfig()
