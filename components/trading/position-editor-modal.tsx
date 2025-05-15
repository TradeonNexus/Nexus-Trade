"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import type { Position } from "@/lib/types"

interface PositionEditorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: Position | null
  onSave: (id: string, stopLoss: number | null, takeProfit: number | null) => void
  currentPrice: number
}

export function PositionEditorModal({ open, onOpenChange, position, onSave, currentPrice }: PositionEditorModalProps) {
  const [stopLoss, setStopLoss] = useState<string>(position?.stopLoss?.toString() || "")
  const [takeProfit, setTakeProfit] = useState<string>(position?.takeProfit?.toString() || "")

  if (!position) return null

  const handleSave = () => {
    onSave(
      position.id,
      stopLoss ? Number.parseFloat(stopLoss) : null,
      takeProfit ? Number.parseFloat(takeProfit) : null,
    )
    onOpenChange(false)
  }

  // Calculate potential profit/loss
  const calculatePnL = (price: number) => {
    if (!position) return { amount: 0, percentage: 0 }

    const priceDiff = position.type === "long" ? price - position.entryPrice : position.entryPrice - price
    const amount = priceDiff * position.size
    const percentage = (priceDiff / position.entryPrice) * 100 * position.leverage

    return { amount, percentage }
  }

  const tpPnL = takeProfit ? calculatePnL(Number.parseFloat(takeProfit)) : { amount: 0, percentage: 0 }
  const slPnL = stopLoss ? calculatePnL(Number.parseFloat(stopLoss)) : { amount: 0, percentage: 0 }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            Edit Position: {position.pair}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Entry Price</div>
                <div className="text-lg">${position.entryPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Current Price</div>
                <div className="text-lg">${currentPrice.toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Position Size</div>
                <div className="text-lg">{position.size.toFixed(3)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">Leverage</div>
                <div className="text-lg">{position.leverage}x</div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Take Profit</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                    placeholder="Enter price"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {takeProfit && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
                      <span className={tpPnL.percentage >= 0 ? "text-green-500" : "text-red-500"}>
                        {tpPnL.percentage.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    className="text-xs text-[#8ECAFF]"
                    onClick={() => {
                      const tp = position.type === "long" ? position.entryPrice * 1.05 : position.entryPrice * 0.95
                      setTakeProfit(tp.toFixed(2))
                    }}
                  >
                    5%
                  </button>
                  <button
                    className="text-xs text-[#8ECAFF]"
                    onClick={() => {
                      const tp = position.type === "long" ? position.entryPrice * 1.1 : position.entryPrice * 0.9
                      setTakeProfit(tp.toFixed(2))
                    }}
                  >
                    10%
                  </button>
                  <button
                    className="text-xs text-[#8ECAFF]"
                    onClick={() => {
                      const tp = position.type === "long" ? position.entryPrice * 1.25 : position.entryPrice * 0.75
                      setTakeProfit(tp.toFixed(2))
                    }}
                  >
                    25%
                  </button>
                  <button
                    className="text-xs text-[#8ECAFF]"
                    onClick={() => {
                      const tp = position.type === "long" ? position.entryPrice * 1.5 : position.entryPrice * 0.5
                      setTakeProfit(tp.toFixed(2))
                    }}
                  >
                    50%
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-1 block">Stop Loss</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    placeholder="Enter price"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  {stopLoss && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs">
                      <span className={slPnL.percentage >= 0 ? "text-green-500" : "text-red-500"}>
                        {slPnL.percentage.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    className="text-xs text-[#8ECAFF]"
                    onClick={() => {
                      const sl = position.type === "long" ? position.entryPrice * 0.95 : position.entryPrice * 1.05
                      setStopLoss(sl.toFixed(2))
                    }}
                  >
                    5%
                  </button>
                  <button
                    className="text-xs text-[#8ECAFF]"
                    onClick={() => {
                      const sl = position.type === "long" ? position.entryPrice * 0.9 : position.entryPrice * 1.1
                      setStopLoss(sl.toFixed(2))
                    }}
                  >
                    10%
                  </button>
                  <button
                    className="text-xs text-[#8ECAFF]"
                    onClick={() => {
                      const sl = position.type === "long" ? position.entryPrice * 0.75 : position.entryPrice * 1.25
                      setStopLoss(sl.toFixed(2))
                    }}
                  >
                    25%
                  </button>
                  <button
                    className="text-xs text-[#8ECAFF]"
                    onClick={() => {
                      const sl = position.type === "long" ? position.entryPrice * 0.5 : position.entryPrice * 1.5
                      setStopLoss(sl.toFixed(2))
                    }}
                  >
                    50%
                  </button>
                </div>
              </div>
            </div>

            <motion.button
              className="w-full py-3 bg-[#8ECAFF] text-black rounded-md font-medium"
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
