"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { AnimatedButton } from "@/components/animations/animated-button"
import { motion } from "framer-motion"
import { Bell, X, Trash } from "lucide-react"
import { PriceEditor } from "./price-editor"

export interface PriceAlertData {
  id: string
  pair: string
  price: number
  condition: "above" | "below"
  createdAt: Date
  isActive: boolean
}

interface PriceAlertModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddAlert: (data: Omit<PriceAlertData, "id" | "createdAt" | "isActive">) => void
  onDeleteAlert: (id: string) => void
  onToggleAlert: (id: string, isActive: boolean) => void
  currentPair: string
  currentPrice: number
  alerts: PriceAlertData[]
}

export function PriceAlertModal({
  open,
  onOpenChange,
  onAddAlert,
  onDeleteAlert,
  onToggleAlert,
  currentPair,
  currentPrice,
  alerts,
}: PriceAlertModalProps) {
  const [alertPrice, setAlertPrice] = useState<number>(currentPrice)
  const [condition, setCondition] = useState<"above" | "below">("above")

  const handleAddAlert = () => {
    onAddAlert({
      pair: currentPair,
      price: alertPrice,
      condition,
    })

    // Reset form for next alert
    setAlertPrice(currentPrice)
    setCondition("above")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-white flex items-center">
            <Bell className="text-primary mr-2 h-5 w-5" />
            Price Alerts
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-6">
          {/* New Alert Form */}
          <div className="space-y-4">
            <p className="text-sm text-gray-300">
              Create an alert for {currentPair} when the price goes above or below a specific level.
            </p>

            <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as "above" | "below")}
                className="bg-gray-800 border-gray-700 text-white rounded-md p-2 text-sm focus:ring-primary focus:border-primary"
              >
                <option value="above">Above</option>
                <option value="below">Below</option>
              </select>

              <PriceEditor initialPrice={alertPrice} onChange={setAlertPrice} precision={2} step={0.01} label="" />
            </div>

            <div className="text-sm text-gray-400">Current price: ${currentPrice.toFixed(2)}</div>

            <AnimatedButton
              className="w-full py-2 bg-primary text-white hover:bg-primary/90"
              onClick={handleAddAlert}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Alert
            </AnimatedButton>
          </div>

          {/* Existing Alerts */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Your Alerts</h3>

            {alerts.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    className="bg-gray-800 rounded-md p-3 flex justify-between items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-white">{alert.pair}</span>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className={`text-sm ${alert.condition === "above" ? "text-green-500" : "text-red-500"}`}>
                          {alert.condition === "above" ? "↑" : "↓"} ${alert.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Created: {alert.createdAt.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={alert.isActive}
                          onChange={(e) => onToggleAlert(alert.id, e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-8 h-4 rounded-full p-1 transition-colors ${
                            alert.isActive ? "bg-primary" : "bg-gray-700"
                          }`}
                        >
                          <motion.div
                            className="bg-white w-2 h-2 rounded-full"
                            animate={{ x: alert.isActive ? 16 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </div>
                      </label>

                      <button
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-700"
                        onClick={() => onDeleteAlert(alert.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 text-sm">No alerts yet. Create one above.</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
