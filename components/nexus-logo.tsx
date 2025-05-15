"use client"
import Link from "next/link"
import { motion } from "framer-motion"

interface NexusLogoProps {
  size?: "sm" | "md" | "lg"
  withLink?: boolean
  href?: string
  className?: string
}

export function NexusLogo({ size = "md", withLink = true, href = "/", className = "" }: NexusLogoProps) {
  const logoSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const Logo = (
    <motion.div
      className={`text-primary font-bold ${logoSizes[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 5H20V35H30V5Z" fill="#0096FF" />
        <path d="M10 5C10 5 15 15 20 20C15 25 10 35 10 35C10 35 5 25 10 20C15 15 10 5 10 5Z" fill="#0066AA" />
      </svg>
    </motion.div>
  )

  if (withLink) {
    return <Link href={href}>{Logo}</Link>
  }

  return Logo
}
