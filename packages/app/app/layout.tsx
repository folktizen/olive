import { PropsWithChildren } from "react"

import { Metadata } from "next"
import localFont from "next/font/local"

import { FathomAnalytics, Navbar } from "@/components"
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
  title: "Olive | Stack crypto over time.",
  description:
    "Olive is a simple, non-custodial tool that uses the CoW protocol to place recurring swaps based on DCA.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
  }
}

const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={stabilGrotesk.variable}>
      <body className="font-sans bg-fixed bg-no-repeat bg-100-100 bg-surface-25 bg-matrix-and-green-gradient text-em-high">
        <FathomAnalytics />
        <Providers>
          <Navbar />
          <div className="px-4 py-12 mx-auto md:py-16 md:px-0">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
