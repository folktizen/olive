"use client"

import { useState } from "react"

import Link from "next/link"

import { ConnectButton, SelectNetwork } from "@/components"
import { DUNE_ANALYTICS_URL, FOLKTIZEN_URL, PATHNAMES } from "@/constants"
import { Button, Icon } from "@/ui"

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className="z-10 flex items-center justify-end w-full gap-4 md:hidden">
      <SelectNetwork />
      <ConnectButton />
      <Button
        variant="secondary"
        iconLeft={isOpen ? "close" : "menu"}
        size="icon"
        className="md:invisible"
        onClick={toggle}
      />
      {isOpen && (
        <>
          <div
            className="fixed bottom-0 left-0 right-0 top-nav-height bg-gray-alpha-75"
            onClick={toggle}
          ></div>
          <div className="absolute left-0 w-full gap-2 px-6 py-2 border-b border-solid rounded-lg bg-surface-25 top-nav-height border-surface-75">
            <Link
              passHref
              href={PATHNAMES.FARMS}
              className="flex items-center py-3 text-em-med"
              onClick={toggle}
            >
              <Icon name="blocks" alt="your farms" size={18} />
              <span className="ml-4">Your Farms</span>
            </Link>
            <hr className="h-0 -mx-6 border-b border-solid border-surface-75" />
            <Link
              href={`${DUNE_ANALYTICS_URL}`}
              className="block py-3 text-em-med"
            >
              Analytics
            </Link>
            <Link href={`${FOLKTIZEN_URL}`} className="block py-3 text-em-med">
              © Folktizen
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
