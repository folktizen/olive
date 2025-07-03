"use client"

import Link from "next/link"

import { PATHNAMES } from "@/constants"
import OliveImg from "@/public/assets/images/olive.svg"
import { ButtonLink, HeadingText } from "@/ui"

export default function NotFound() {
  const discordLink = process.env.DISCORD_URL ?? "https://discord.gg/useolive"

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto my-32 space-y-7">
      <OliveImg />
      <HeadingText size={3}>Page not found</HeadingText>
      <HeadingText className="text-center text-em-med">
        {`We're sorry, but the page you are looking for cannot be found. Please
        check the URL and try again. If you believe this is an error, please
        contact us on our `}
        <Link
          href={discordLink}
          className="cursor-pointer hover:underline underline-offset-2 text-em-high"
        >
          discord
        </Link>
        .
      </HeadingText>
      <div>
        <ButtonLink href={PATHNAMES.HOME}>Go back to homepage</ButtonLink>
      </div>
    </div>
  )
}
