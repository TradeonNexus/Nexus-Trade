"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import type { TradingPair, OrderType, PositionType } from "@/lib/types"
import { useIsMobile } from "@/hooks/use-mobile"

interface TradeFormProps {
  pair: TradingPair
  onExecuteTrade: (tradeDetails: any) => void
  defaultType?: PositionType
  defaultOrderType?: OrderType
  className?: string
}

export function TradeForm({
  pair,
  onExecuteTrade,
  defaultType = "long",
  defaultOrderType = "market",
  className = "",
}: TradeFormProps) {
  const [amount, setAmount] = useState<number>(0.01)
  const [leverage, setLeverage] = useState<number>(5)
  const [type, setType] = useState<PositionType>(defaultType)
  const [orderType, setOrderType] = useState<OrderType>(defaultOrderType)
  const [price, setPrice] = useState<number>(pair.lastPrice)
  const isMobile = useIsMobile()

  // Update price when pair changes
  useEffect(() => {
    setPrice(pair.lastPrice)
  }, [pair])

  // Update type and order type when defaults change
  useEffect(() => {
    setType(defaultType)
  }, [defaultType])

  useEffect(() => {
    setOrderType(defaultOrderType)
  }, [defaultOrderType])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setAmount(value)
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setPrice(value)
    }
  }

  const handleLeverageChange = (value: number[]) => {
    setLeverage(value[0])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    onExecuteTrade({
      amount,
      leverage,
      type,
      orderType,
      price,
    })
  }

  const leveragePresets = [1, 2, 5, 10, 25, 50, 100]

  return (
    <form onSubmit={handleSubmit} className={className}>
      {!isMobile && (
        <div className="mb-4">
          <div className="flex mb-2">
            <Button
              type="button"
              variant={type === "long" ? "default" : "outline"}
              className={`flex-1 ${type === "long" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              onClick={() => setType("long")}
            >
              Long
            </Button>
            <Button
              type="button"
              variant={type === "short" ? "default" : "outline"}
              className={`flex-1 ${type === "short" ? "bg-red-600 hover:bg-red-700" : ""}`}
              onClick={() => setType("short")}
            >
              Short
            </Button>
          </div>
          <div className="flex">
            <Button
              type="button"
              variant={orderType === "market" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setOrderType("market")}
            >
              Market
            </Button>
            <Button
              type="button"
              variant={orderType === "limit" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setOrderType("limit")}
            >
              Limit
            </Button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Amount ({pair.baseAsset})</label>
        <Input type="number" value={amount} onChange={handleAmountChange} step="0.001" min="0.001" className="w-full" />
      </div>

      {orderType === "limit" && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price ({pair.quoteAsset})</label>
          <Input type="number" value={price} onChange={handlePriceChange} step="0.01" min="0.01" className="w-full" />
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Leverage: {leverage}x</label>
          <div className="flex space-x-1">
            {leveragePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                className={`px-1.5 py-0.5 text-xs rounded ${
                  leverage === preset ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
                onClick={() => setLeverage(preset)}
              >
                {preset}x
              </button>
            ))}
          </div>
        </div>
        <Slider
          defaultValue={[leverage]}
          min={1}
          max={100}
          step={1}
          onValueChange={handleLeverageChange}
          value={[leverage]}
        />
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Entry Price:</span>
            <span>
              {orderType === "market" ? pair.lastPrice : price} {pair.quoteAsset}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Liquidation Price:</span>
            <span>
              {type === "long"
                ? ((orderType === "market" ? pair.lastPrice : price) * (1 - 1 / leverage)).toFixed(2)
                : ((orderType === "market" ? pair.lastPrice : price) * (1 + 1 / leverage)).toFixed(2)}{" "}
              {pair.quoteAsset}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Fees:</span>
            <span>
              {(amount * 0.001).toFixed(4)} {pair.baseAsset}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Order Value:</span>
            <span>
              {(amount * (orderType === "market" ? pair.lastPrice : price)).toFixed(2)} {pair.quoteAsset}
            </span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className={`w-full ${type === "long" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
      >
        {type === "long" ? "Long" : "Short"} {pair.baseAsset}
      </Button>
    </form>
  )
}
