"use client"

import { OliveLogoIcon, OliveLogoNameImg } from "@/public/assets"

export default function Logo() {
  return (
    <>
      <OliveLogoIcon title="Olive logo icon" />
      <OliveLogoNameImg
        title="Olive logo name"
        className="hidden ml-3 md:block"
      />
    </>
  )
}
