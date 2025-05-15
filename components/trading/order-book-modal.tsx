"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { OrderBookEntry } from "@/lib/types"

interface OrderBookModalProps {
  isOpen: boolean
  onClose: () => void
  orderBook: {
    bids: OrderBookEntry[]
    asks: OrderBookEntry[]
  }
  pairSymbol: string
}

export function OrderBookModal({ isOpen, onClose, orderBook, pairSymbol }: OrderBookModalProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-[#0A0A0A] rounded-lg border border-gray-800 p-4 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Order Book</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Bids */}
          <div>
            <div className="grid grid-cols-2 gap-0 text-sm font-medium text-gray-400 pb-2 border-b border-gray-800">
              <div>Total ({pairSymbol})</div>
              <div className="text-right">Price</div>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-1 mt-2">
              {orderBook.bids.map((bid, index) => (
                <div
                  key={`bid-${index}`}
                  className="grid grid-cols-2 gap-0 text-sm p-2 hover:bg-gray-800 rounded-md relative overflow-hidden"
                >
                  <div className="z-10">{bid.total.toFixed(2)}</div>
                  <div className="text-right text-green-500 z-10">{bid.price.toFixed(2)}</div>
                  <div
                    className="absolute inset-0 bg-green-500/10"
                    style={{ width: `${Math.min(bid.total * 3, 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Asks */}
          <div>
            <div className="grid grid-cols-2 gap-0 text-sm font-medium text-gray-400 pb-2 border-b border-gray-800">
              <div>Price</div>
              <div className="text-right">Total ({pairSymbol})</div>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-1 mt-2">
              {orderBook.asks.map((ask, index) => (
                <div
                  key={`ask-${index}`}
                  className="grid grid-cols-2 gap-0 text-sm p-2 hover:bg-gray-800 rounded-md relative overflow-hidden"
                >
                  <div className="text-red-500 z-10">{ask.price.toFixed(2)}</div>
                  <div className="text-right z-10">{ask.total.toFixed(2)}</div>
                  <div
                    className="absolute inset-0 bg-red-500/10"
                    style={{ width: `${Math.min(ask.total * 3, 100)}%`, right: 0, left: "auto" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
