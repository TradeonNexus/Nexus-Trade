"use client"

import type { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

interface OrdersTableProps {
  orders: Order[]
  onCancel: (orderId: string) => void
  compact?: boolean
}

export function OrdersTable({ orders, onCancel, compact = false }: OrdersTableProps) {
  const isMobile = useIsMobile() || compact

  if (orders.length === 0) {
    return <div className="text-center py-8 text-gray-500">No open orders</div>
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-3 rounded-lg border border-gray-800 bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${order.type === "long" ? "text-green-500" : "text-red-500"}`}>
                  {order.type === "long" ? "Long" : "Short"}
                </span>
                <span className="ml-2 text-sm">{order.pair}</span>
              </div>
              <span className="text-sm font-medium">{order.orderType === "limit" ? "Limit" : "Market"}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="text-white">{order.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="text-white">{order.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Leverage:</span>
                <span className="text-white">{order.leverage}x</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="text-white">{new Date(order.time).toLocaleTimeString()}</span>
              </div>
            </div>
            <Button variant="destructive" size="sm" className="w-full h-8" onClick={() => onCancel(order.id)}>
              Cancel
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <th className="pb-2">Pair</th>
            <th className="pb-2">Type</th>
            <th className="pb-2">Order Type</th>
            <th className="pb-2">Size</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Leverage</th>
            <th className="pb-2">Time</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-200 dark:border-gray-800">
              <td className="py-3">{order.pair}</td>
              <td className={`py-3 ${order.type === "long" ? "text-green-500" : "text-red-500"}`}>
                {order.type === "long" ? "Long" : "Short"}
              </td>
              <td className="py-3">{order.orderType}</td>
              <td className="py-3">{order.amount}</td>
              <td className="py-3">{order.price}</td>
              <td className="py-3">{order.leverage}x</td>
              <td className="py-3">{new Date(order.time).toLocaleTimeString()}</td>
              <td className="py-3">
                <Button variant="destructive" size="sm" onClick={() => onCancel(order.id)}>
                  Cancel
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
