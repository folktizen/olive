"use client"

import { useEffect, Suspense } from "react"
import Script from "next/script"

import { usePathname, useSearchParams } from "next/navigation"

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_APP_WEBSITE_ID ?? ""
const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_APP_SCRIPT_URL ?? ""

const TrackPageView = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!umamiWebsiteId || !umamiScriptUrl) {
      console.log("Umami site ID or script URL not set, skipping analytics")
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).umami) {
      ;(window as any).umami.trackView(pathname + "?" + searchParams.toString())
    }
  }, [pathname, searchParams])

  return null
}

/**
 * Component to integrate Umami analytics.
 * @see https://umami.is/docs/tracker-api
 */
export const UmamiAnalytics = () => {
  return (
    <>
      <Script
        src={umamiScriptUrl}
        data-website-id={umamiWebsiteId}
        strategy="afterInteractive"
      />
      <Suspense fallback={null}>
        <TrackPageView />
      </Suspense>
    </>
  )
}
