import { PropsWithChildren } from "react"

export const metadata = {
  title: "Your Stacks | Olive"
}

export default function YourStacksLayout({ children }: PropsWithChildren) {
  return <div className="max-w-5xl mx-auto md:pt-24">{children}</div>
}
