"use client";

import { useState } from "react";
import { isAddress } from "viem";
import { cva } from "class-variance-authority";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { useTokenListContext } from "@/contexts";
import { Token } from "@/models/token";

export type TokenLogoSize = "3xs" | "2xs" | "xs" | "sm" | "md" | "lg";

interface TokenIconProps {
  className?: string;
  size?: TokenLogoSize;
  token: Token;
}

export const TokenIcon = ({ className, size, token }: TokenIconProps) => {
  const { getTokenFromList, getTokenLogoURL } = useTokenListContext();
  const [isImgBroken, setIsImgBroken] = useState<Boolean>(false);

  if (!isAddress(token.address) || !getTokenFromList(token.address) || isImgBroken)
    return <DefaultTokenIcon token={token} className={className} size={size} />;

  return (
    <Image
      src={getTokenLogoURL(token.address)}
      className={tokenIconStyles({ size, className })}
      alt={token.name}
      width={54}
      height={54}
      onError={() => {
        setIsImgBroken(true);
      }}
    />
  );
};

const DefaultTokenIcon = ({ token, size, className }: TokenIconProps) => (
  <div
    className={twMerge(
      tokenIconStyles({ size }),
      className,
      "bg-primary-100 border border-primary-200 break-all",
    )}
  >
    {token.symbol}
  </div>
);

export const tokenIconStyles = cva(
  ["flex items-center justify-center", "rounded-full bg-surface-50"],
  {
    variants: {
      size: {
        lg: ["w-10 h-10 text-[7px]"],
        md: ["w-8 h-8 text-[6px]"],
        sm: ["w-6 h-6 text-[5px]"],
        xs: ["w-5 h-5 text-[4px]"],
        "2xs": ["w-4 h-4 text-[4px]"],
        "3xs": ["w-3 h-3 text-[3px]"],
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);
