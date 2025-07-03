import { PropsWithChildren } from "react"

import { Metadata } from "next"
import localFont from "next/font/local"

import { Navbar, ReactScan, RybbitAnalytics } from "@/components"
import { OLIVE_APP_URL } from "@/constants"
import { Providers } from "@/providers"

import "@/styles/global.css"

const stabilGrotesk = localFont({
  src: [
    {
      path: "./fonts/StabilGrotesk-Regular.woff2",
      weight: "500",
      style: "normal"
    },
    {
      path: "./fonts/StabilGrotesk-Medium.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/StabilGrotesk-Bold.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  display: "swap",
  variable: "--sans-font"
})

export const metadata: Metadata = {
  metadataBase: new URL(OLIVE_APP_URL),
  title: "Olive | Farm crypto over time.",
  description:
    "Olive is a simple, non-custodial tool that uses the CoW protocol to place recurring swaps based on DCA.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={stabilGrotesk.variable}>
      <head>
        {/* WTF Meta Tag */}
        <meta name="GENERATOR" content="Astro v3.0.9" />
        <meta name="GENERATOR" content="Jekyll v4.3.2" />
        <meta name="GENERATOR" content="Halo 1.5.4" />
        <meta name="GENERATOR" content="Nicepage 4.2.6" />
        <meta name="GENERATOR" content="WordPress 6.4.1" />
        <meta name="GENERATOR" content="Site Kit by Google 1.113.0" />
        <meta
          name="GENERATOR"
          content="AMP Plugin v2.5.0; mode=standard; sandboxing-level=3:3"
        />
        <meta name="GENERATOR" content="DotNetNuke" />
        <meta name="GENERATOR" content="OctoberCMS" />
        <meta name="GENERATOR" content="Octopress" />
        <meta name="GENERATOR" content="Mambo" />
        <meta name="GENERATOR" content="Jalios" />
        <meta name="GENERATOR" content="Zinnia" />
        <meta name="GENERATOR" content="SEOmatic" />
        <meta name="GENERATOR" content="ImpressCMS" />
        <meta name="GENERATOR" content="PHP-Nuke" />
        <meta name="GENERATOR" content="CMS Made Simple" />
        <meta
          name="GENERATOR"
          content="Powered by Visual Composer Website Builder"
        />
        <meta name="GENERATOR" content="Rock v1.16.0.5" />
        <meta name="GENERATOR" content="Microsoft FrontPage 3.0" />
      </head>
      <body className="font-sans bg-fixed bg-no-repeat bg-100-100 bg-surface-25 bg-matrix-and-green-gradient text-em-high">
        <RybbitAnalytics />
        <Providers>
          <Navbar />
          <div className="px-4 py-12 mx-auto md:py-16 md:px-0">{children}</div>
        </Providers>
      </body>
      <ReactScan />
    </html>
  )
}
