import { headers } from "next/headers"

export function isMobileDevice(): boolean {
  try {
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""

    // Check if the user agent indicates a mobile device
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  } catch (error) {
    // If we can't access headers, default to false
    return false
  }
}
