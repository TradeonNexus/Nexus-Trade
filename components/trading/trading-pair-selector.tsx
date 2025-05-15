"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import type { TradingPair } from "@/lib/types"

interface TradingPairSelectorProps {
  pairs: TradingPair[]
  selectedPair: TradingPair
  onSelectPair: (pair: TradingPair) => void
  className?: string
}

export function TradingPairSelector({ pairs, selectedPair, onSelectPair, className = "" }: TradingPairSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [favorites, setFavorites] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("trading-pair-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("trading-pair-favorites", JSON.stringify(favorites))
  }, [favorites])

  // Filter pairs based on search query
  const filteredPairs = pairs.filter(
    (pair) =>
      pair.baseAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.quoteAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${pair.baseAsset}/${pair.quoteAsset}`.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort pairs to show favorites first
  const sortedPairs = [...filteredPairs].sort((a, b) => {
    const aIsFavorite = favorites.includes(a.id)
    const bIsFavorite = favorites.includes(b.id)
    if (aIsFavorite && !bIsFavorite) return -1
    if (!aIsFavorite && bIsFavorite) return 1
    return 0
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleFavorite = (e: React.MouseEvent, pairId: string) => {
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(pairId) ? prev.filter((id) => id !== pairId) : [...prev, pairId]))
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.div
        className="flex items-center bg-gray-800 rounded-md px-3 py-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.8)" }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-2 flex-1">
          {selectedPair.baseAssetLogo ? (
            <Image
              src={selectedPair.baseAssetLogo || "/placeholder.svg"}
              alt={selectedPair.baseAsset}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
              {selectedPair.baseAsset.substring(0, 2)}
            </div>
          )}
          <span className="font-medium">
            {selectedPair.baseAsset}/{selectedPair.quoteAsset}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-md shadow-lg z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search pairs..."
                  className="pl-8 bg-gray-800 border-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {sortedPairs.length > 0 ? (
                sortedPairs.map((pair) => (
                  <motion.div
                    key={pair.id}
                    className={`px-3 py-2 hover:bg-gray-800 cursor-pointer flex items-center justify-between ${
                      selectedPair.id === pair.id ? "bg-gray-800" : ""
                    }`}
                    onClick={() => {
                      onSelectPair(pair)
                      setIsOpen(false)
                    }}
                    whileHover={{ backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                  >
                    <div className="flex items-center space-x-2">
                      {pair.baseAssetLogo ? (
                        <Image
                          src={pair.baseAssetLogo || "/placeholder.svg"}
                          alt={pair.baseAsset}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                          {pair.baseAsset.substring(0, 2)}
                        </div>
                      )}
                      <span>
                        {pair.baseAsset}/{pair.quoteAsset}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={pair.change24h >= 0 ? "text-green-500" : "text-red-500"}>
                        {pair.change24h >= 0 ? "+" : ""}
                        {pair.change24h.toFixed(2)}%
                      </span>
                      <motion.button
                        onClick={(e) => toggleFavorite(e, pair.id)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            favorites.includes(pair.id) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                          }`}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-gray-400">No pairs found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
export type { TradingPair }
