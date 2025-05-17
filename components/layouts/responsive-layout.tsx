"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isMobileView, setIsMobileView] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    // Set initial value
    checkMobile()

    // Add event listener
    window.addEventListener("resize", checkMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Force the viewport meta tag to prevent zooming on mobile
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]')
    if (!metaViewport) {
      const meta = document.createElement("meta")
      meta.name = "viewport"
      meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      document.head.appendChild(meta)
    } else {
      metaViewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no")
    }
  }, [])

  return <div className={isMobileView ? "mobile-view" : "desktop-view"}>{children}</div>
}
