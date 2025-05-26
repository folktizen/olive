"use client"

import Link from "next/link"
import { ButtonBaseProps, buttonStyles, getIconSize } from "./base"
import { Icon } from "@/ui/icon/Icon"

interface ButtonLinkProps extends ButtonBaseProps {
  href: string
  target?: string
}

export function ButtonLink({
  target,
  children,
  className,
  size,
  variant,
  width,
  disabled,
  href,
  active,
  iconLeft,
  iconRight,
  id,
  onClick
}: ButtonLinkProps) {
  return (
    <Link
      target={target}
      id={id}
      href={href}
      tabIndex={0}
      className={buttonStyles({
        size,
        variant,
        width,
        disabled,
        active,
        className
      })}
      onClick={onClick}
    >
      {iconLeft && <Icon size={getIconSize(size)} name={iconLeft} />}
      {children && <div>{children}</div>}
      {iconRight && <Icon size={getIconSize(size)} name={iconRight} />}
    </Link>
  )
}
