"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, BarChart2, Droplet, Download, Upload, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  isExpanded: boolean
  onClick?: () => void
}

const NavItem = ({ href, icon, label, isActive, isExpanded, onClick }: NavItemProps) => {
  return (
    <Link href={href} onClick={onClick} className="block">
      <motion.div
        className={cn(
          "flex items-center p-3 my-2 rounded-md transition-colors",
          isActive ? "bg-gray-800" : "bg-gray-900 hover:bg-gray-800",
        )}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="text-gray-300">{icon}</div>
        {isExpanded && <span className="ml-3 text-gray-300">{label}</span>}
      </motion.div>
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  const navItems = [
    { href: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/trading", icon: <BarChart2 size={20} />, label: "Trading" },
    // Remove or comment out the analytics link
    // { href: "/analytics", icon: <LineChart size={20} />, label: "Analytics" },
    { href: "/faucet", icon: <Droplet size={20} />, label: "Faucet" },
    { href: "/deposit", icon: <Download size={20} />, label: "Deposit" },
    { href: "/withdraw", icon: <Upload size={20} />, label: "Withdraw" },
  ]

  // Close expanded sidebar when route changes on mobile
  useEffect(() => {
    setIsExpanded(false)
  }, [pathname])

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-16 bottom-0 z-40 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300",
        isExpanded ? "w-56" : "w-16",
      )}
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex-1 py-4 px-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
            isExpanded={isExpanded}
          />
        ))}
      </div>
      <div className="py-4 px-2">
        <NavItem
          href="/sign-out"
          icon={<LogOut size={20} />}
          label="Sign out"
          isActive={false}
          isExpanded={isExpanded}
          onClick={() => {
            localStorage.removeItem("nexus_wallet")
            window.location.href = "/"
          }}
        />
      </div>
    </motion.div>
  )
}
