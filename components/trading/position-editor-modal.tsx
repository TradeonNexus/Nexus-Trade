"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { Position } from "@/lib/types"

interface PositionEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: Position
  onSave: (id: string, stopLoss: number | null, takeProfit: number | null) => void
  currentPrice: number
}

export function PositionEditorModal({ open, onOpenChange, position, onSave, currentPrice }: PositionEditorModalProps) {
  const [stopLoss, setStopLoss] = useState<number | null>(position.stopLoss)
  const [takeProfit, setTakeProfit] = useState<number | null>(position.takeProfit)

  // Calculate percentage from price
  const calculatePercentage = (price: number | null) => {
    if (price === null) return null

    if (position.type === "long") {
      // For long positions
      if (price < position.entryPrice) {
        // Stop Loss (negative)
        return -((position.entryPrice - price) / position.entryPrice) * 100
      } else {
        // Take Profit (positive)
        return ((price - position.entryPrice) / position.entryPrice) * 100
      }
    } else {
      // For short positions
      if (price > position.entryPrice) {
        // Stop Loss (negative)
        return -((price - position.entryPrice) / position.entryPrice) * 100
      } else {
        // Take Profit (positive)
        return ((position.entryPrice - price) / position.entryPrice) * 100
      }
    }
  }

  // Calculate price from percentage
  const calculatePrice = (percentage: number) => {
    if (position.type === "long") {
      return position.entryPrice * (1 + percentage / 100)
    } else {
      return position.entryPrice * (1 - percentage / 100)
    }
  }

  // Preset percentages for stop loss
  const stopLossPresets = [-2, -5, -10, -20]

  // Preset percentages for take profit
  const takeProfitPresets = [5, 10, 25, 50, 100]

  // Handle stop loss change from presets
  const handleStopLossPreset = (percentage: number) => {
    const price = calculatePrice(percentage)
    setStopLoss(Number(price.toFixed(2)))
  }

  // Handle take profit change from presets
  const handleTakeProfitPreset = (percentage: number) => {
    const price = calculatePrice(percentage)
    setTakeProfit(Number(price.toFixed(2)))
  }

  // Handle save
  const handleSave = () => {
    onSave(position.id, stopLoss, takeProfit)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A0A0A] border border-gray-800/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Position</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Position Info */}
          <div className="flex justify-between items-center p-3 bg-[#111] rounded-md">
            <div>
              <p className="text-sm text-gray-400">Position</p>
              <p className="font-medium">{position.pair}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Type</p>
              <p className={position.type === "long" ? "text-green-500" : "text-red-500"}>
                {position.type.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Entry Price & Current Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#111] rounded-md">
              <p className="text-sm text-gray-400">Entry Price</p>
              <p className="font-medium">${position.entryPrice.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-[#111] rounded-md">
              <p className="text-sm text-gray-400">Current Price</p>
              <p className="font-medium">${currentPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Stop Loss */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium">Stop Loss</p>
              <p className="text-sm text-gray-400">
                {stopLoss ? `${calculatePercentage(stopLoss)?.toFixed(2)}%` : "Not Set"}
              </p>
            </div>

            <div className="flex space-x-2 mb-2">
              <Input
                type="number"
                value={stopLoss || ""}
                onChange={(e) => setStopLoss(e.target.value ? Number(e.target.value) : null)}
                placeholder="Price"
                className="bg-[#111] border-gray-800"
              />
              <button
                className="px-3 py-1 bg-[#111] text-xs rounded-md hover:bg-[#1a1a1a]"
                onClick={() => setStopLoss(null)}
              >
                Clear
              </button>
            </div>

            <div className="flex space-x-2">
              {stopLossPresets.map((preset) => (
                <motion.button
                  key={`sl-${preset}`}
                  className="flex-1 py-1 text-xs bg-[#111] rounded-md"
                  onClick={() => handleStopLossPreset(preset)}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {preset}%
                </motion.button>
              ))}
            </div>
          </div>

          {/* Take Profit */}
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium">Take Profit</p>
              <p className="text-sm text-gray-400">
                {takeProfit ? `${calculatePercentage(takeProfit)?.toFixed(2)}%` : "Not Set"}
              </p>
            </div>

            <div className="flex space-x-2 mb-2">
              <Input
                type="number"
                value={takeProfit || ""}
                onChange={(e) => setTakeProfit(e.target.value ? Number(e.target.value) : null)}
                placeholder="Price"
                className="bg-[#111] border-gray-800"
              />
              <button
                className="px-3 py-1 bg-[#111] text-xs rounded-md hover:bg-[#1a1a1a]"
                onClick={() => setTakeProfit(null)}
              >
                Clear
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {takeProfitPresets.map((preset) => (
                <motion.button
                  key={`tp-${preset}`}
                  className="px-3 py-1 text-xs bg-[#111] rounded-md"
                  onClick={() => handleTakeProfitPreset(preset)}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(75, 85, 99, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {preset}%
                </motion.button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            className="w-full py-3 bg-[#8ECAFF] text-black rounded-md font-medium"
            onClick={handleSave}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Changes
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
