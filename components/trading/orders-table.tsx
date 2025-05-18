"use client"

import { motion } from "framer-motion"
import type { Order } from "@/lib/types"

interface OrdersTableProps {
  orders: Order[]
  onCancelOrder: (id: string) => void
}

export function OrdersTable({ orders, onCancelOrder }: OrdersTableProps) {
  if (orders.length === 0) {
    return <div className="p-8 text-center text-gray-400">No open orders</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
            <th className="p-4">Pair</th>
            <th className="p-4">Type</th>
            <th className="p-4">Side</th>
            <th className="p-4">Price</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Filled</th>
            <th className="p-4">Time</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <motion.tr
              key={order.id}
              className="border-b border-gray-800 hover:bg-[#001C30]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td className="p-4">{order.pair}</td>
              <td className="p-4">{order.orderType}</td>
              <td className={`p-4 ${order.side === "buy" ? "text-green-500" : "text-red-500"}`}>
                {order.side === "buy" ? "Buy" : "Sell"}
              </td>
              <td className="p-4">${order.price.toFixed(2)}</td>
              <td className="p-4">{order.amount.toFixed(2)}</td>
              <td className="p-4">{order.filled ? `${(order.filled * 100).toFixed(0)}%` : "0%"}</td>
              <td className="p-4">{new Date(order.timestamp).toLocaleTimeString()}</td>
              <td className="p-4">
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
                  onClick={() => onCancelOrder(order.id)}
                >
                  Cancel
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
