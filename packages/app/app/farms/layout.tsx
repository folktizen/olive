import { PropsWithChildren } from "react"

export const metadata = {
  title: "Your Farms | Olive"
}

export default function YourFarmsLayout({ children }: PropsWithChildren) {
  return <div className="max-w-5xl mx-auto md:pt-24">{children}</div>
}
