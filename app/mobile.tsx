// Must stay as a client component
"use client"

import { useEffect } from "react"

export default function MobileStylesApplier() {
  useEffect(() => {
    // Apply mobile-specific meta tags
    const meta = document.createElement("meta")
    meta.name = "viewport"
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    document.head.appendChild(meta)

    // Add a class to the body to help with mobile styling
    document.body.classList.add("mobile-enabled")

    return () => {
      // Clean up
      document.body.classList.remove("mobile-enabled")
    }
  }, [])

  return null
}
