"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bell } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"
import { CandlestickChart } from "@/components/trading/candlestick-chart"
import { OrderBookModal } from "@/components/trading/order-book-modal"
import { PriceAlertModal } from "@/components/trading/price-alert"
import { PositionEditorModal } from "@/components/trading/position-editor-modal"
import { TradingPairSelector } from "@/components/trading/trading-pair-selector"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { generateMockCandleData, suiTradingPairs, generateMockOrderBook } from "@/lib/mock-data"
import type {
  CandleData,
  Position,
  Order,
  TradeHistory,
  TradingPair,
  OrderBookEntry,
  PriceAlertData,
} from "@/lib/types"

export default function TradingPageContent() {
  const { wallet } = useWallet()
  const { toast } = useToast()

  // State for trading
  const [selectedPair, setSelectedPair] = useState<TradingPair>(suiTradingPairs[0])
  const [currentPrice, setCurrentPrice] = useState(128.2)
  const [candleData, setCandleData] = useState<CandleData[]>([])
  const [timeframe, setTimeframe] = useState("1h")
  const [showOrderBook, setShowOrderBook] = useState(false)
  const [showPriceAlert, setShowPriceAlert] = useState(false)
  const [activeTab, setActiveTab] = useState("positions")
  const [tradeType, setTradeType] = useState<"long" | "short">("long")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [leverage, setLeverage] = useState(1)
  const [amount, setAmount] = useState(0)
  const [selectedAsset, setSelectedAsset] = useState("WBTC")
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertData[]>([])

  // State for trading data
  const [positions, setPositions] = useState<Position[]>([
    {
      id: "pos-1",
      pair: "SBTCSUSDT",
      type: "long",
      entryPrice: 94.567,
      markPrice: 94.567,
      leverage: 5,
      size: 0.567,
      margin: 0.567 / 5,
      liquidationPrice: 125.38,
      stopLoss: null,
      takeProfit: null,
      pnl: 0.567,
      pnlPercentage: 5.38,
      timestamp: Date.now(),
    },
  ])
  const [orders, setOrders] = useState<Order[]>([])
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([])
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({
    bids: [],
    asks: [],
  })

  // Initialize with mock data
  useEffect(() => {
    try {
      loadPairData(selectedPair, timeframe)

      // Update data periodically
      const interval = setInterval(() => {
        updatePriceAndChartData()
      }, 5000)

      return () => clearInterval(interval)
    } catch (error) {
      console.error("Error initializing trading data:", error)
    }
  }, [selectedPair, timeframe])

  // Check price alerts
  useEffect(() => {
    try {
      checkPriceAlerts(currentPrice)
    } catch (error) {
      console.error("Error checking price alerts:", error)
    }
  }, [currentPrice, priceAlerts])

  const loadPairData = (pair: TradingPair, tf: string) => {
    try {
      // Generate mock candle data based on timeframe
      const mockData = generateMockCandleData(100, tf)
      setCandleData(mockData)

      // Set current price from the last candle
      if (mockData.length > 0) {
        const lastPrice = mockData[mockData.length - 1].close
        setCurrentPrice(lastPrice)

        // Generate order book based on current price
        const mockOrderBook = generateMockOrderBook(lastPrice)
        setOrderBook(mockOrderBook)
      }
    } catch (error) {
      console.error("Error loading pair data:", error)
      // Set fallback data
      setCandleData([])
      setOrderBook({ bids: [], asks: [] })
    }
  }

  const updatePriceAndChartData = () => {
    try {
      setCandleData((prev) => {
        if (prev.length === 0) return prev

        const lastCandle = prev[prev.length - 1]

        // Determine time increment based on timeframe
        let timeIncrement: number
        switch (timeframe) {
          case "1m":
            timeIncrement = 60 * 1000
            break
          case "5m":
            timeIncrement = 5 * 60 * 1000
            break
          case "15m":
            timeIncrement = 15 * 60 * 1000
            break
          case "1h":
            timeIncrement = 60 * 60 * 1000
            break
          case "4h":
            timeIncrement = 4 * 60 * 60 * 1000
            break
          case "1d":
            timeIncrement = 24 * 60 * 60 * 1000
            break
          default:
            timeIncrement = 60 * 60 * 1000
        }

        const time = lastCandle.time + timeIncrement
        const open = lastCandle.close
        const close = open * (1 + (Math.random() - 0.5) * 0.01)
        const high = Math.max(open, close) * (1 + Math.random() * 0.005)
        const low = Math.min(open, close) * (1 - Math.random() * 0.005)
        const volume = Math.random() * 100 + 50

        const newCandle: CandleData = { time, open, high, low, close, volume }
        setCurrentPrice(close)

        // Update positions with new price
        updatePositions(close)

        return [...prev.slice(1), newCandle]
      })

      // Update order book
      setOrderBook((prevOrderBook) => ({
        bids: prevOrderBook.bids.map((bid) => ({
          ...bid,
          price: Number.parseFloat((bid.price * (1 + (Math.random() - 0.5) * 0.001)).toFixed(2)),
          total: Number.parseFloat((bid.total * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2)),
        })),
        asks: prevOrderBook.asks.map((ask) => ({
          ...ask,
          price: Number.parseFloat((ask.price * (1 + (Math.random() - 0.5) * 0.001)).toFixed(2)),
          total: Number.parseFloat((ask.total * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2)),
        })),
      }))
    } catch (error) {
      console.error("Error updating price and chart data:", error)
    }
  }

  const updatePositions = (newPrice: number) => {
    try {
      setPositions((prevPositions) =>
        prevPositions.map((position) => {
          // Calculate new PnL
          const priceDiff = position.type === "long" ? newPrice - position.entryPrice : position.entryPrice - newPrice

          const pnl = priceDiff * position.size
          const pnlPercentage = (priceDiff / position.entryPrice) * 100 * position.leverage

          // Check for stop loss and take profit
          if (
            position.stopLoss !== null &&
            ((position.type === "long" && newPrice <= position.stopLoss) ||
              (position.type === "short" && newPrice >= position.stopLoss))
          ) {
            // Stop loss triggered
            closePosition(position.id, "Stop loss triggered")
            return position // Will be removed by closePosition
          }

          if (
            position.takeProfit !== null &&
            ((position.type === "long" && newPrice >= position.takeProfit) ||
              (position.type === "short" && newPrice <= position.takeProfit))
          ) {
            // Take profit triggered
            closePosition(position.id, "Take profit triggered")
            return position // Will be removed by closePosition
          }

          return {
            ...position,
            markPrice: newPrice,
            pnl,
            pnlPercentage,
          }
        }),
      )
    } catch (error) {
      console.error("Error updating positions:", error)
    }
  }

  const checkPriceAlerts = (price: number) => {
    try {
      priceAlerts.forEach((alert) => {
        if (!alert.isActive) return

        if (alert.condition === "above" && price >= alert.price) {
          // Alert triggered
          toast({
            title: "Price Alert Triggered",
            description: `${alert.pair} price is now above $${alert.price.toFixed(2)}`,
          })

          // Deactivate the alert
          setPriceAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, isActive: false } : a)))
        } else if (alert.condition === "below" && price <= alert.price) {
          // Alert triggered
          toast({
            title: "Price Alert Triggered",
            description: `${alert.pair} price is now below $${alert.price.toFixed(2)}`,
          })

          // Deactivate the alert
          setPriceAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, isActive: false } : a)))
        }
      })
    } catch (error) {
      console.error("Error checking price alerts:", error)
    }
  }

  const handlePairChange = (pair: TradingPair) => {
    try {
      setSelectedPair(pair)
      loadPairData(pair, timeframe)
    } catch (error) {
      console.error("Error changing trading pair:", error)
    }
  }

  const handleTimeframeChange = (tf: string) => {
    try {
      setTimeframe(tf)
      loadPairData(selectedPair, tf)
    } catch (error) {
      console.error("Error changing timeframe:", error)
    }
  }

  const executeTrade = async () => {
    if (!wallet?.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to trade.",
        variant: "destructive",
      })
      return false
    }

    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return false
    }

    try {
      // Create a new position
      const newPosition: Position = {
        id: `pos-${Date.now()}`,
        pair: `${selectedPair.baseAsset}${selectedPair.quoteAsset}`,
        type: tradeType,
        entryPrice: currentPrice,
        markPrice: currentPrice,
        leverage: leverage,
        size: amount,
        margin: amount / leverage,
        liquidationPrice:
          tradeType === "long" ? currentPrice * (1 - 0.9 / leverage) : currentPrice * (1 + 0.9 / leverage),
        stopLoss: null,
        takeProfit: null,
        pnl: 0,
        pnlPercentage: 0,
        timestamp: Date.now(),
      }

      setPositions((prev) => [...prev, newPosition])

      // Add to trade history
      const newTrade: TradeHistory = {
        id: `trade-${Date.now()}`,
        pair: `${selectedPair.baseAsset}${selectedPair.quoteAsset}`,
        type: tradeType,
        price: currentPrice,
        size: amount,
        fee: amount * 0.0006, // 0.06% fee
        timestamp: Date.now(),
        action: "open",
      }

      setTradeHistory((prev) => [...prev, newTrade])

      toast({
        title: "Trade Executed",
        description: `Successfully opened a ${tradeType} position with ${leverage}x leverage.`,
      })

      // Reset amount
      setAmount(0)

      return true
    } catch (error) {
      console.error("Failed to execute trade", error)
      toast({
        title: "Trade Failed",
        description: "Failed to execute trade. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const closePosition = async (id: string, reason?: string) => {
    try {
      // Find the position
      const position = positions.find((p) => p.id === id)
      if (!position) return false

      // Add to trade history
      const newTrade: TradeHistory = {
        id: `trade-${Date.now()}-${id}`,
        pair: position.pair,
        type: position.type === "long" ? "short" : "long", // Opposite to close
        price: currentPrice,
        size: position.size,
        fee: position.size * 0.0006, // 0.06% fee
        timestamp: Date.now(),
        action: "close",
        pnl: position.pnl,
      }

      setTradeHistory((prev) => [...prev, newTrade])

      // Remove the position
      setPositions((prev) => prev.filter((p) => p.id !== id))

      toast({
        title: "Position Closed",
        description: reason || "Your position has been successfully closed.",
      })

      return true
    } catch (error) {
      console.error("Failed to close position", error)
      toast({
        title: "Close Failed",
        description: "Failed to close position. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position)
  }

  const handleSavePosition = (id: string, stopLoss: number | null, takeProfit: number | null) => {
    try {
      setPositions((prev) => prev.map((p) => (p.id === id ? { ...p, stopLoss, takeProfit } : p)))

      toast({
        title: "Position Updated",
        description: "Stop loss and take profit levels have been updated.",
      })
    } catch (error) {
      console.error("Error saving position:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update position. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddAlert = (data: Omit<PriceAlertData, "id" | "createdAt" | "isActive">) => {
    try {
      const newAlert: PriceAlertData = {
        id: `alert-${Date.now()}`,
        ...data,
        createdAt: new Date(),
        isActive: true,
      }

      setPriceAlerts((prev) => [...prev, newAlert])

      toast({
        title: "Price Alert Added",
        description: `Alert will trigger when ${data.pair} price goes ${data.condition} $${data.price.toFixed(2)}`,
      })
    } catch (error) {
      console.error("Error adding price alert:", error)
      toast({
        title: "Alert Failed",
        description: "Failed to add price alert. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAlert = (id: string) => {
    try {
      setPriceAlerts((prev) => prev.filter((alert) => alert.id !== id))
    } catch (error) {
      console.error("Error deleting price alert:", error)
    }
  }

  const handleToggleAlert = (id: string, isActive: boolean) => {
    try {
      setPriceAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isActive } : alert)))
    } catch (error) {
      console.error("Error toggling price alert:", error)
    }
  }

  const setMaxAmount = () => {
    // In a real app, this would be based on available balance
    setAmount(10)
  }

  return (
    <AuthenticatedLayout>
      <div className="p-0 bg-black min-h-screen">
        {/* Main trading interface */}
        <div className="grid grid-cols-1 gap-4 p-4">
          {/* Trading pair selector and chart area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Chart - Now takes more space */}
            <div className="lg:col-span-3 bg-[#0A0A0A] rounded-lg border border-gray-800/30">
              {/* Trading pair selector */}
              <div className="flex justify-between items-center p-2 border-b border-gray-800/30">
                <div className="flex-1">
                  <TradingPairSelector
                    pairs={suiTradingPairs}
                    selectedPair={selectedPair}
                    onSelectPair={handlePairChange}
                    className="w-48"
                  />
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    className="p-2 rounded-md bg-[#111] text-white hover:bg-[#1a1a1a]"
                    onClick={() => setShowPriceAlert(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell size={16} />
                  </motion.button>
                  <motion.button
                    className="px-4 py-2 bg-[#111] text-white rounded-md hover:bg-[#1a1a1a] transition-opacity"
                    onClick={() => setShowOrderBook(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Open Order Book
                  </motion.button>
                </div>
              </div>

              {/* Timeframe selector */}
              <div className="flex space-x-1 p-2 border-b border-gray-800/30">
                {["1m", "5m", "15m", "1h", "4h", "1d"].map((tf) => (
                  <motion.button
                    key={tf}
                    className={`px-3 py-1 rounded-md text-xs ${
                      timeframe === tf ? "bg-[#8ECAFF] text-black" : "bg-[#111] text-white hover:bg-[#1a1a1a]"
                    }`}
                    onClick={() => handleTimeframeChange(tf)}
                    whileHover={{ scale: timeframe !== tf ? 1.05 : 1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tf}
                  </motion.button>
                ))}
              </div>

              {/* Chart */}
              <div className="p-0">
                {candleData.length > 0 && (
                  <CandlestickChart data={candleData} height={500} timeframe={timeframe} className="w-full" />
                )}
              </div>
            </div>

            {/* Right side - Trading Form */}
            <div className="bg-[#0A0A0A] rounded-lg border border-gray-800/30 p-4">
              {/* Current Price Display */}
              <div className="mb-4 text-center">
                <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>
                <div className="text-sm text-gray-400">Current Price</div>
              </div>

              {/* Long/Short buttons */}
              <div className="flex mb-4">
                <motion.button
                  className={`flex-1 py-2 rounded-l-md ${
                    tradeType === "long"
                      ? "bg-[#111] text-white border-2 border-white"
                      : "bg-[#0A0A0A] text-white border border-gray-800/30"
                  }`}
                  onClick={() => setTradeType("long")}
                  whileHover={{ scale: tradeType !== "long" ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Long <span className="ml-1">↗</span>
                </motion.button>
                <motion.button
                  className={`flex-1 py-2 rounded-r-md ${
                    tradeType === "short"
                      ? "bg-[#111] text-white border-2 border-white"
                      : "bg-[#0A0A0A] text-white border border-gray-800/30"
                  }`}
                  onClick={() => setTradeType("short")}
                  whileHover={{ scale: tradeType !== "short" ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Short <span className="ml-1">↘</span>
                </motion.button>
              </div>

              {/* Market/Limit toggle */}
              <div className="flex mb-4">
                <button
                  className={`flex-1 py-2 text-sm ${
                    orderType === "market" ? "bg-[#111] text-white border-b-2 border-[#8ECAFF]" : "text-gray-400"
                  }`}
                  onClick={() => setOrderType("market")}
                >
                  Market
                </button>
                <button
                  className={`flex-1 py-2 text-sm ${
                    orderType === "limit" ? "bg-[#111] text-white border-b-2 border-[#8ECAFF]" : "text-gray-400"
                  }`}
                  onClick={() => setOrderType("limit")}
                >
                  Limit
                </button>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span className="text-sm font-medium">
                    {amount} {selectedAsset}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="bg-[#111] border-gray-800/30 pr-16"
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white"
                    onClick={setMaxAmount}
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Asset Selection */}
              <div className="flex space-x-2 mb-4">
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    selectedAsset === "WBTC"
                      ? "bg-[#111] text-white"
                      : "bg-[#0A0A0A] text-gray-400 border border-gray-800/30"
                  }`}
                  onClick={() => setSelectedAsset("WBTC")}
                >
                  WBTC
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    selectedAsset === "ETH"
                      ? "bg-[#111] text-white"
                      : "bg-[#0A0A0A] text-gray-400 border border-gray-800/30"
                  }`}
                  onClick={() => setSelectedAsset("ETH")}
                >
                  ETH
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    selectedAsset === "SUI"
                      ? "bg-[#111] text-white"
                      : "bg-[#0A0A0A] text-gray-400 border border-gray-800/30"
                  }`}
                  onClick={() => setSelectedAsset("SUI")}
                >
                  SUI
                </button>
              </div>

              {/* Leverage */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Leverage: {leverage}x</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">1x</span>
                  <Slider
                    value={[leverage]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setLeverage(value[0])}
                    className="flex-1"
                  />
                  <span className="text-sm">10x</span>
                </div>
                <div className="flex justify-between mt-2 space-x-2">
                  <button
                    className={`px-2 py-1 rounded-md text-xs ${
                      leverage === 2 ? "bg-[#111] text-white" : "bg-[#0A0A0A] text-gray-400 border border-gray-800/30"
                    }`}
                    onClick={() => setLeverage(2)}
                  >
                    2x
                  </button>
                  <button
                    className={`px-2 py-1 rounded-md text-xs ${
                      leverage === 5 ? "bg-[#111] text-white" : "bg-[#0A0A0A] text-gray-400 border border-gray-800/30"
                    }`}
                    onClick={() => setLeverage(5)}
                  >
                    5x
                  </button>
                  <button
                    className={`px-2 py-1 rounded-md text-xs ${
                      leverage === 10 ? "bg-[#111] text-white" : "bg-[#0A0A0A] text-gray-400 border border-gray-800/30"
                    }`}
                    onClick={() => setLeverage(10)}
                  >
                    10x
                  </button>
                </div>
              </div>

              {/* Trade Summary */}
              <div className="mb-4 p-3 bg-[#111] rounded-md">
                <div className="text-sm font-medium mb-2">Trade Summary</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-400">Entry Price:</div>
                  <div className="text-right">${currentPrice.toFixed(2)}</div>

                  <div className="text-gray-400">Position Size:</div>
                  <div className="text-right">
                    {amount || 0} {selectedAsset}
                  </div>

                  <div className="text-gray-400">Leverage:</div>
                  <div className="text-right">{leverage}x</div>

                  <div className="text-gray-400">Est. Liquidation Price:</div>
                  <div className="text-right">
                    $
                    {tradeType === "long"
                      ? (currentPrice * (1 - 0.9 / leverage)).toFixed(2)
                      : (currentPrice * (1 + 0.9 / leverage)).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Trade Button */}
              <motion.button
                className={`w-full py-3 rounded-md hover:bg-[#1a1a1a] transition-colors mb-4 font-bold bg-[#111] text-white border border-gray-700`}
                onClick={executeTrade}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tradeType === "long" ? "Open Long Position" : "Open Short Position"}
              </motion.button>
            </div>
          </div>

          {/* Positions/Orders Tabs */}
          <div className="bg-[#0A0A0A] rounded-lg border border-gray-800/30">
            <Tabs defaultValue="positions" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="border-b border-gray-800/30 bg-transparent">
                <TabsTrigger
                  value="positions"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#8ECAFF] data-[state=active]:bg-transparent data-[state=active]:rounded-none"
                >
                  Positions
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#8ECAFF] data-[state=active]:bg-transparent data-[state=active]:rounded-none"
                >
                  Open Orders
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-[#8ECAFF] data-[state=active]:bg-transparent data-[state=active]:rounded-none"
                >
                  History
                </TabsTrigger>
              </TabsList>

              <TabsContent value="positions">
                {positions.length > 0 ? (
                  <div className="p-4">
                    <div className="text-lg font-bold mb-2">SBTCSUSDT</div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <div>Unrealized PnL (SUSDT)</div>
                      <div>ROE</div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div>0.567</div>
                      <div>0.567</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Positions</div>
                        <div className="text-lg">0.567</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Margin</div>
                        <div className="text-lg">54.567</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Entry price</div>
                        <div className="text-lg">94.567</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Mark price</div>
                        <div className="text-lg">94.567</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">MMR</div>
                        <div className="text-lg">5.38%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Estimated Liquidation Price</div>
                        <div className="text-lg">125.38%</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <motion.button
                        className="flex-1 py-2 bg-[#111] text-white rounded-md hover:bg-[#1a1a1a]"
                        onClick={() => handleEditPosition(positions[0])}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        TP/SL
                      </motion.button>
                      <motion.button
                        className="flex-1 py-2 bg-[#111] text-white rounded-md hover:bg-[#1a1a1a]"
                        onClick={() => {
                          // Reverse position
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Reverse
                      </motion.button>
                      <motion.button
                        className="flex-1 py-2 bg-[#111] text-white rounded-md hover:bg-[#1a1a1a]"
                        onClick={() => closePosition(positions[0].id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">No open positions</div>
                )}
              </TabsContent>

              <TabsContent value="orders">
                {orders.filter((o) => o.status === "open").length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left text-xs text-gray-400">
                        <tr>
                          <th className="p-3">Pair</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Side</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Filled</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders
                          .filter((o) => o.status === "open")
                          .map((order) => (
                            <tr key={order.id} className="border-t border-gray-800/10">
                              <td className="p-3">{order.pair}</td>
                              <td className="p-3">{order.type}</td>
                              <td className="p-3">
                                <span className="text-white">{order.side.toUpperCase()}</span>
                              </td>
                              <td className="p-3">${order.price.toFixed(2)}</td>
                              <td className="p-3">{order.amount.toFixed(3)}</td>
                              <td className="p-3">{order.filled.toFixed(3)}</td>
                              <td className="p-3">
                                <motion.button
                                  className="px-3 py-1 bg-[#111] text-xs rounded-md hover:bg-[#1a1a1a]"
                                  onClick={() => {
                                    setOrders(orders.map((o) => (o.id === order.id ? { ...o, status: "canceled" } : o)))
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  Cancel
                                </motion.button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">No open orders</div>
                )}
              </TabsContent>

              <TabsContent value="history">
                {tradeHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left text-xs text-gray-400">
                        <tr>
                          <th className="p-3">Pair</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Side</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Fee</th>
                          <th className="p-3">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tradeHistory.map((trade) => (
                          <tr key={trade.id} className="border-t border-gray-800/10">
                            <td className="p-3">{trade.pair}</td>
                            <td className="p-3">{trade.action}</td>
                            <td className="p-3">
                              <span className="text-white">{trade.type.toUpperCase()}</span>
                            </td>
                            <td className="p-3">${trade.price.toFixed(2)}</td>
                            <td className="p-3">{trade.size.toFixed(3)}</td>
                            <td className="p-3">${trade.fee.toFixed(4)}</td>
                            <td className="p-3">{new Date(trade.timestamp).toLocaleTimeString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">No trade history</div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Order Book Modal */}
        <AnimatePresence>
          {showOrderBook && (
            <OrderBookModal
              isOpen={showOrderBook}
              onClose={() => setShowOrderBook(false)}
              orderBook={orderBook}
              pairSymbol={selectedPair.baseAsset}
            />
          )}
        </AnimatePresence>

        {/* Price Alert Modal */}
        <AnimatePresence>
          {showPriceAlert && (
            <PriceAlertModal
              open={showPriceAlert}
              onOpenChange={setShowPriceAlert}
              onAddAlert={handleAddAlert}
              onDeleteAlert={handleDeleteAlert}
              onToggleAlert={handleToggleAlert}
              currentPair={`${selectedPair.baseAsset}${selectedPair.quoteAsset}`}
              currentPrice={currentPrice}
              alerts={priceAlerts}
            />
          )}
        </AnimatePresence>

        {/* Position Editor Modal */}
        <AnimatePresence>
          {editingPosition && (
            <PositionEditorModal
              open={!!editingPosition}
              onOpenChange={(open) => {
                if (!open) setEditingPosition(null)
              }}
              position={editingPosition}
              onSave={handleSavePosition}
              currentPrice={currentPrice}
            />
          )}
        </AnimatePresence>
      </div>
    </AuthenticatedLayout>
  )
}
