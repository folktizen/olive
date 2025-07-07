import Script from "next/script"

export function RybbitAnalytics() {
  const isDev = process.env.NODE_ENV === "development"

  return (
    <Script
      src="/api/script.js"
      data-site-id="1"
      {...(isDev && { "data-api-key": process.env.NEXT_PUBLIC_RYBBIT_API_KEY })}
      strategy="afterInteractive"
    />
  )
}
