"use client";

import { useEffect, Suspense } from "react";
import Script from "next/script";

import { usePathname, useSearchParams } from "next/navigation";

const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_LANDING_WEBSITE_ID ?? "";
const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_LANDING_SCRIPT_URL ?? "";

/**
 * This is an approach suggested by Next maintainers.
 * @see https://umami.is/docs/tracker-api
 */
const TrackPageView = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!umamiWebsiteId || !umamiScriptUrl) {
      console.log("Umami site ID or script URL not set, skipping analytics");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).umami) {
      (window as any).umami.trackView(pathname + "?" + searchParams.toString());
    }
  }, [pathname, searchParams]);

  return null;
};

export const UmamiAnalytics = () => {
  return (
    <>
      <Script src={umamiScriptUrl} data-website-id={umamiWebsiteId} strategy="afterInteractive" />
      <Suspense fallback={null}>
        <TrackPageView />
      </Suspense>
    </>
  );
};
