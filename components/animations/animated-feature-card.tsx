"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface AnimatedFeatureCardProps {
  icon: string
  title: string
  description: string
  iconAlt: string
  className?: string
}

export function AnimatedFeatureCard({ icon, title, description, iconAlt, className = "" }: AnimatedFeatureCardProps) {
  return (
    <motion.div
      className={`bg-white rounded-lg p-6 md:p-8 text-center ${className}`}
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-12 h-12 md:w-14 md:h-14 bg-light-blue rounded-full flex items-center justify-center mx-auto mb-4"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src={icon || "/placeholder.svg"}
          alt={iconAlt}
          width={24}
          height={24}
          className="w-6 h-6 md:w-7 md:h-7"
        />
      </motion.div>
      <motion.h3 className="text-lg md:text-xl font-bold mb-2">{title}</motion.h3>
      <motion.p className="text-gray-600 text-xs md:text-sm">{description}</motion.p>
    </motion.div>
  )
}
