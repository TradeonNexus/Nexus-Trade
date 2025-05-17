"use client"

import { useState, useEffect } from "react"
import { CandlestickChart } from "./candlestick-chart"
import { TradeForm } from "./trade-form"
import { PositionsTable } from "./positions-table"
import { OrdersTable } from "./orders-table"
import { TradeHistoryTable } from "./trade-history-table"
import { OrderBook } from "./order-book"
import { TradingPairSelector } from "./trading-pair-selector"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { mockTradingPairs, generateMockCandleData } from "@/lib/mock-data"
import type { Position, Order, TradeHistory, TradingPair, CandleData, OrderBookEntry } from "@/lib/types"

export function TradingPageContent() {
  const isMobile = useIsMobile()
  const { toast } = useToast()

  // State for trading pairs
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>(mockTradingPairs)
  const [selectedPair, setSelectedPair] = useState<TradingPair>(tradingPairs[0])

  // State for candle data
  const [candleData, setCandleData] = useState<CandleData[]>([])
  const [timeframe, setTimeframe] = useState<string>("1h")

  // State for order book
  const [showOrderBook, setShowOrderBook] = useState(!isMobile)
  const [orderBookData, setOrderBookData] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({
    bids: [],
    asks: [],
  })

  // State for positions, orders, and trade history
  const [positions, setPositions] = useState<Position[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([])

  // State for price alerts
  const [priceAlerts, setPriceAlerts] = useState<{ price: number; direction: "above" | "below" }[]>([])

  // State for current price
  const [currentPrice, setCurrentPrice] = useState<number>(0)

  // State for trade parameters
  const [tradeAmount, setTradeAmount] = useState<number>(0)
  const [tradeLeverage, setTradeLeverage] = useState<number>(1)
  const [tradeType, setTradeType] = useState<"long" | "short">("long")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [limitPrice, setLimitPrice] = useState<number>(0)
  const [stopLoss, setStopLoss] = useState<number | null>(null)
  const [takeProfit, setTakeProfit] = useState<number | null>(null)

  // State for mobile view
  const [activeTab, setActiveTab] = useState<string>("chart")

  // Load trading pair data
  useEffect(() => {
    // In a real app, this would fetch from an API
    setTradingPairs(mockTradingPairs)
    setSelectedPair(mockTradingPairs[0])
  }, [])

  // Load candle data when pair or timeframe changes
  useEffect(() => {
    if (selectedPair) {
      const newCandleData = generateMockCandleData(100, timeframe, selectedPair.lastPrice)
      setCandleData(newCandleData)
      setCurrentPrice(newCandleData[newCandleData.length - 1].close)

      // Generate mock order book data based on the current price
      const lastPrice = newCandleData[newCandleData.length - 1].close
      const bids = Array.from({ length: 10 }, (_, i) => ({
        price: Number.parseFloat((lastPrice * (1 - (i + 1) * 0.001)).toFixed(2)),
        amount: Number.parseFloat((Math.random() * 10 + 1).toFixed(4)),
      }))

      const asks = Array.from({ length: 10 }, (_, i) => ({
        price: Number.parseFloat((lastPrice * (1 + (i + 1) * 0.001)).toFixed(2)),
        amount: Number.parseFloat((Math.random() * 10 + 1).toFixed(4)),
      }))

      setOrderBookData({ bids, asks })
      setLimitPrice(lastPrice)
    }
  }, [selectedPair, timeframe])

  // Update price periodically to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (candleData.length > 0) {
        const lastCandle = { ...candleData[candleData.length - 1] }
        const priceChange = lastCandle.close * (Math.random() * 0.002 - 0.001)
        const newPrice = Number.parseFloat((lastCandle.close + priceChange).toFixed(2))

        setCurrentPrice(newPrice)

        // Update the last candle
        const updatedCandle = {
          ...lastCandle,
          close: newPrice,
          high: Math.max(lastCandle.high, newPrice),
          low: Math.min(lastCandle.low, newPrice),
        }

        const updatedCandleData = [...candleData.slice(0, -1), updatedCandle]
        setCandleData(updatedCandleData)

        // Check price alerts
        priceAlerts.forEach((alert) => {
          if (
            (alert.direction === "above" && newPrice >= alert.price) ||
            (alert.direction === "below" && newPrice <= alert.price)
          ) {
            toast({
              title: "Price Alert",
              description: `${selectedPair.symbol} price is now ${alert.direction} $${alert.price}`,
              variant: "default",
            })

            // Remove triggered alert
            setPriceAlerts(priceAlerts.filter((a) => a !== alert))
          }
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [candleData, priceAlerts, selectedPair, toast])

  // Function to execute a trade
  const executeTrade = () => {
    if (tradeAmount <= 0) {
      toast({
        title: "Invalid Trade",
        description: "Please enter a valid trade amount",
        variant: "destructive",
      })
      return
    }

    const entryPrice = orderType === "market" ? currentPrice : limitPrice
    const liquidationPrice =
      tradeType === "long" ? entryPrice * (1 - (1 / tradeLeverage) * 0.9) : entryPrice * (1 + (1 / tradeLeverage) * 0.9)

    if (orderType === "market") {
      // Create a new position for market orders
      const newPosition: Position = {
        id: `pos-${Date.now()}`,
        pair: selectedPair.symbol,
        type: tradeType,
        amount: tradeAmount,
        leverage: tradeLeverage,
        entryPrice,
        liquidationPrice,
        stopLoss,
        takeProfit,
        pnl: 0,
        pnlPercentage: 0,
        timestamp: new Date().toISOString(),
      }

      setPositions([...positions, newPosition])

      // Add to trade history
      const newTradeHistory: TradeHistory = {
        id: `trade-${Date.now()}`,
        pair: selectedPair.symbol,
        type: tradeType,
        amount: tradeAmount,
        price: entryPrice,
        timestamp: new Date().toISOString(),
      }

      setTradeHistory([newTradeHistory, ...tradeHistory])

      toast({
        title: "Trade Executed",
        description: `${tradeType === "long" ? "Long" : "Short"} position opened for ${tradeAmount} ${selectedPair.symbol} at $${entryPrice}`,
        variant: "default",
      })
    } else {
      // Create a new order for limit orders
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        pair: selectedPair.symbol,
        type: tradeType,
        orderType,
        amount: tradeAmount,
        price: limitPrice,
        leverage: tradeLeverage,
        stopLoss,
        takeProfit,
        status: "open",
        timestamp: new Date().toISOString(),
      }

      setOrders([...orders, newOrder])

      toast({
        title: "Order Placed",
        description: `${tradeType === "long" ? "Long" : "Short"} limit order placed for ${tradeAmount} ${selectedPair.symbol} at $${limitPrice}`,
        variant: "default",
      })
    }

    // Reset trade form
    setTradeAmount(0)
    setStopLoss(null)
    setTakeProfit(null)
  }

  // Function to close a position
  const closePosition = (positionId: string) => {
    const position = positions.find((p) => p.id === positionId)

    if (position) {
      // Remove the position
      setPositions(positions.filter((p) => p.id !== positionId))

      // Add to trade history
      const newTradeHistory: TradeHistory = {
        id: `trade-${Date.now()}`,
        pair: position.pair,
        type: position.type === "long" ? "short" : "long", // Closing is the opposite
        amount: position.amount,
        price: currentPrice,
        timestamp: new Date().toISOString(),
      }

      setTradeHistory([newTradeHistory, ...tradeHistory])

      toast({
        title: "Position Closed",
        description: `${position.type === "long" ? "Long" : "Short"} position closed for ${position.amount} ${position.pair}`,
        variant: "default",
      })
    }
  }

  // Function to cancel an order
  const cancelOrder = (orderId: string) => {
    setOrders(orders.filter((o) => o.id !== orderId))

    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled",
      variant: "default",
    })
  }

  // Function to add a price alert
  const addPriceAlert = (price: number, direction: "above" | "below") => {
    setPriceAlerts([...priceAlerts, { price, direction }])

    toast({
      title: "Price Alert Added",
      description: `You will be notified when price goes ${direction} $${price}`,
      variant: "default",
    })
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-black text-white">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <TradingPairSelector pairs={tradingPairs} selectedPair={selectedPair} onSelectPair={setSelectedPair} />
          <div className="text-right">
            <div className="text-sm text-gray-400">Last Price</div>
            <div className="text-xl font-bold">${currentPrice.toFixed(2)}</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2 mb-0">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="orderbook">Order Book</TabsTrigger>
          </TabsList>

          <TabsContent value="chart" className="flex-1 p-0 m-0">
            <div className="h-[300px]">
              <CandlestickChart
                data={candleData}
                timeframe={timeframe}
                onTimeframeChange={setTimeframe}
                priceAlerts={priceAlerts}
              />
            </div>
          </TabsContent>

          <TabsContent value="orderbook" className="flex-1 p-0 m-0">
            <OrderBook data={orderBookData} currentPrice={currentPrice} />
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-gray-800">
          <TradeForm
            pair={selectedPair}
            currentPrice={currentPrice}
            amount={tradeAmount}
            setAmount={setTradeAmount}
            leverage={tradeLeverage}
            setLeverage={setTradeLeverage}
            tradeType={tradeType}
            setTradeType={setTradeType}
            orderType={orderType}
            setOrderType={setOrderType}
            limitPrice={limitPrice}
            setLimitPrice={setLimitPrice}
            stopLoss={stopLoss}
            setStopLoss={setStopLoss}
            takeProfit={takeProfit}
            setTakeProfit={setTakeProfit}
            onExecuteTrade={executeTrade}
            isMobile={true}
          />
        </div>

        <Tabs defaultValue="positions" className="p-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="positions">
            <PositionsTable
              positions={positions}
              currentPrice={currentPrice}
              onClosePosition={closePosition}
              isMobile={true}
            />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTable orders={orders} onCancelOrder={cancelOrder} isMobile={true} />
          </TabsContent>

          <TabsContent value="history">
            <TradeHistoryTable tradeHistory={tradeHistory} isMobile={true} />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Desktop view
  return (
    <div className="grid grid-cols-12 gap-4 p-4 h-full">
      <div className={`${showOrderBook ? "col-span-9" : "col-span-12"} space-y-4`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <TradingPairSelector pairs={tradingPairs} selectedPair={selectedPair} onSelectPair={setSelectedPair} />
            <div>
              <div className="text-sm text-gray-400">Last Price</div>
              <div className="text-xl font-bold">${currentPrice.toFixed(2)}</div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowOrderBook(!showOrderBook)}>
            {showOrderBook ? "Hide Order Book" : "Show Order Book"}
          </Button>
        </div>

        <div className="h-[500px] bg-gray-900 rounded-lg overflow-hidden">
          <CandlestickChart
            data={candleData}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            priceAlerts={priceAlerts}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Positions</h3>
            <PositionsTable positions={positions} currentPrice={currentPrice} onClosePosition={closePosition} />
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Orders</h3>
            <OrdersTable orders={orders} onCancelOrder={cancelOrder} />
          </div>

          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Trade History</h3>
            <TradeHistoryTable tradeHistory={tradeHistory} />
          </div>
        </div>
      </div>

      {showOrderBook && (
        <div className="col-span-3 space-y-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Trade</h3>
            <TradeForm
              pair={selectedPair}
              currentPrice={currentPrice}
              amount={tradeAmount}
              setAmount={setTradeAmount}
              leverage={tradeLeverage}
              setLeverage={setTradeLeverage}
              tradeType={tradeType}
              setTradeType={setTradeType}
              orderType={orderType}
              setOrderType={setOrderType}
              limitPrice={limitPrice}
              setLimitPrice={setLimitPrice}
              stopLoss={stopLoss}
              setStopLoss={setStopLoss}
              takeProfit={takeProfit}
              setTakeProfit={setTakeProfit}
              onExecuteTrade={executeTrade}
            />
          </div>

          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <OrderBook data={orderBookData} currentPrice={currentPrice} />
          </div>
        </div>
      )}
    </div>
  )
}
