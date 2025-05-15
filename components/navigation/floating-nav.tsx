"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: string
  label: string
  isActive: boolean
  onClick?: () => void
}

const NavItem = ({ href, icon, label, isActive, onClick }: NavItemProps) => {
  return (
    <Link href={href} onClick={onClick} className="block">
      <motion.div
        className={cn(
          "flex flex-col items-center justify-center p-3 rounded-lg transition-all",
          isActive
            ? "bg-gradient-to-b from-[#001C30] to-[#003355] text-[#8ECAFF]"
            : "hover:bg-[#001C30]/50 text-gray-400 hover:text-gray-300",
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-6 h-6 relative mb-1">
          <Image
            src={icon || "/placeholder.svg"}
            alt={label}
            fill
            className={isActive ? "opacity-100 brightness-200" : "opacity-70"}
          />
        </div>
        <span className="text-xs font-medium">{label}</span>
      </motion.div>
    </Link>
  )
}

export function FloatingNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const navItems = [
    { href: "/dashboard", icon: "/images/icons/dashboard.png", label: "Dashboard" },
    { href: "/trading", icon: "/images/icons/trade.png", label: "Trading" },
    { href: "/analytics", icon: "/images/icons/analytics.png", label: "Analytics" },
    { href: "/faucet", icon: "/images/icons/faucet.png", label: "Faucet" },
    { href: "/deposit", icon: "/images/icons/deposit.png", label: "Deposit" },
    { href: "/withdraw", icon: "/images/icons/withdraw.png", label: "Withdraw" },
  ]

  // Handle scroll to hide/show nav
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#0A0A0A]/90 backdrop-blur-md rounded-full border border-gray-800 shadow-lg px-2 py-1"
      initial={{ y: 100, opacity: 0 }}
      animate={{
        y: isVisible ? 0 : 100,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
        <NavItem
          href="/sign-in"
          icon="/images/icons/signout.png"
          label="Sign Out"
          isActive={false}
          onClick={() => {
            localStorage.removeItem("nexus_wallet")
            window.location.href = "/"
          }}
        />
      </div>
    </motion.div>
  )
}
