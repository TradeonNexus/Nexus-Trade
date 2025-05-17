"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"

export function MobileRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  useEffect(() => {
    // Only redirect for specific pages
    if (isMobile && pathname === "/trading") {
      router.push("/mobile-trading")
    } else if (!isMobile && pathname === "/mobile-trading") {
      router.push("/trading")
    }
  }, [isMobile, pathname, router])

  return null
}
