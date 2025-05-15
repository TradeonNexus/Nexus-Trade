"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Bell, Trash2, BellOff } from "lucide-react"

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
  const [alertPrice, setAlertPrice] = useState(currentPrice)
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above")

  const handleAddAlert = () => {
    onAddAlert({
      pair: currentPair,
      price: alertPrice,
      condition: alertCondition,
    })

    // Reset form
    setAlertPrice(currentPrice)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0A0A0A] border border-gray-800/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Price Alerts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Price */}
          <div className="flex justify-between items-center p-3 bg-[#111] rounded-md">
            <div>
              <p className="text-sm text-gray-400">Current Price</p>
              <p className="font-medium">${currentPrice.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Pair</p>
              <p className="font-medium">{currentPair}</p>
            </div>
          </div>

          {/* New Alert Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Create New Alert</h3>

            <div className="flex space-x-2">
              <button
                className={`flex-1 py-2 text-sm rounded-md ${
                  alertCondition === "above" ? "bg-[#8ECAFF] text-black" : "bg-[#111] text-white"
                }`}
                onClick={() => setAlertCondition("above")}
              >
                Price Above
              </button>
              <button
                className={`flex-1 py-2 text-sm rounded-md ${
                  alertCondition === "below" ? "bg-[#8ECAFF] text-black" : "bg-[#111] text-white"
                }`}
                onClick={() => setAlertCondition("below")}
              >
                Price Below
              </button>
            </div>

            <div className="flex space-x-2">
              <Input
                type="number"
                value={alertPrice}
                onChange={(e) => setAlertPrice(Number(e.target.value))}
                placeholder="Alert Price"
                className="bg-[#111] border-gray-800"
              />
              <motion.button
                className="px-4 py-2 bg-[#8ECAFF] text-black rounded-md"
                onClick={handleAddAlert}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell size={16} />
              </motion.button>
            </div>
          </div>

          {/* Existing Alerts */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Your Alerts</h3>

            {alerts.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex justify-between items-center p-3 bg-[#111] rounded-md">
                    <div>
                      <p className="text-sm font-medium">{alert.pair}</p>
                      <p className="text-xs text-gray-400">
                        {alert.condition === "above" ? "Above" : "Below"} ${alert.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => onToggleAlert(alert.id, !alert.isActive)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-white"
                      >
                        {alert.isActive ? <Bell size={16} /> : <BellOff size={16} />}
                      </motion.button>
                      <motion.button
                        onClick={() => onDeleteAlert(alert.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-400">No alerts created yet</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
