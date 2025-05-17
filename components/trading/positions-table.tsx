"use client"

import type { Position } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

interface PositionsTableProps {
  positions: Position[]
  onClose: (positionId: string) => void
  onEdit: (position: Position) => void
  compact?: boolean
}

export function PositionsTable({ positions, onClose, onEdit, compact = false }: PositionsTableProps) {
  const isMobile = useIsMobile() || compact

  if (positions.length === 0) {
    return <div className="text-center py-8 text-gray-500">No open positions</div>
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {positions.map((position) => (
          <div key={position.id} className="p-3 rounded-lg border border-gray-800 bg-gray-900">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className={`text-sm font-medium ${position.type === "long" ? "text-green-500" : "text-red-500"}`}>
                  {position.type === "long" ? "Long" : "Short"}
                </span>
                <span className="ml-2 text-sm">{position.pair}</span>
              </div>
              <span className={`text-sm font-medium ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                {position.pnl >= 0 ? "+" : ""}
                {position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="text-white">{position.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Leverage:</span>
                <span className="text-white">{position.leverage}x</span>
              </div>
              <div className="flex justify-between">
                <span>Entry:</span>
                <span className="text-white">{position.entryPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Liquidation:</span>
                <span className="text-white">{position.liquidationPrice}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => onEdit(position)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" className="flex-1 h-8" onClick={() => onClose(position.id)}>
                Close
              </Button>
            </div>
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
            <th className="pb-2">Size</th>
            <th className="pb-2">Leverage</th>
            <th className="pb-2">Entry Price</th>
            <th className="pb-2">Liquidation</th>
            <th className="pb-2">PnL</th>
            <th className="pb-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.id} className="border-b border-gray-200 dark:border-gray-800">
              <td className="py-3">{position.pair}</td>
              <td className={`py-3 ${position.type === "long" ? "text-green-500" : "text-red-500"}`}>
                {position.type === "long" ? "Long" : "Short"}
              </td>
              <td className="py-3">{position.amount}</td>
              <td className="py-3">{position.leverage}x</td>
              <td className="py-3">{position.entryPrice}</td>
              <td className="py-3">{position.liquidationPrice}</td>
              <td className={`py-3 ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                {position.pnl >= 0 ? "+" : ""}
                {position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
              </td>
              <td className="py-3">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(position)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onClose(position.id)}>
                    Close
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
