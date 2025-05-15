"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { useWallet } from "@/contexts/wallet-context"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"
import { CandlestickChart } from "@/components/trading/candlestick-chart"
import { OrderBookModal } from "@/components/trading/order-book-modal"
import { PriceAlertModal } from "@/components/trading/price-alert"
import { PositionEditorModal } from "@/components/trading/position-editor-modal"
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
import { ChevronDown, Bell, User } from "lucide-react"

export default function TradingPage() {
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
    loadPairData(selectedPair, timeframe)

    // Update data periodically
    const interval = setInterval(() => {
      updatePriceAndChartData()
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedPair, timeframe])

  // Check price alerts
  useEffect(() => {
    checkPriceAlerts(currentPrice)
  }, [currentPrice, priceAlerts])

  const loadPairData = (pair: TradingPair, tf: string) => {
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
  }

  const updatePriceAndChartData = () => {
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
    setOrderBook({
      bids: orderBook.bids.map((bid) => ({
        ...bid,
        price: Number.parseFloat((bid.price * (1 + (Math.random() - 0.5) * 0.001)).toFixed(2)),
        total: Number.parseFloat((bid.total * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2)),
      })),
      asks: orderBook.asks.map((ask) => ({
        ...ask,
        price: Number.parseFloat((ask.price * (1 + (Math.random() - 0.5) * 0.001)).toFixed(2)),
        total: Number.parseFloat((ask.total * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2)),
      })),
    })
  }

  const updatePositions = (newPrice: number) => {
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
  }

  const checkPriceAlerts = (price: number) => {
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
  }

  const handlePairChange = (pair: TradingPair) => {
    setSelectedPair(pair)
    loadPairData(pair, timeframe)
  }

  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf)
    loadPairData(selectedPair, tf)
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
    setPositions((prev) => prev.map((p) => (p.id === id ? { ...p, stopLoss, takeProfit } : p)))

    toast({
      title: "Position Updated",
      description: "Stop loss and take profit levels have been updated.",
    })
  }

  const handleAddAlert = (data: Omit<PriceAlertData, "id" | "createdAt" | "isActive">) => {
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
  }

  const handleDeleteAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const handleToggleAlert = (id: string, isActive: boolean) => {
    setPriceAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, isActive } : alert)))
  }

  const setMaxAmount = () => {
    // In a real app, this would be based on available balance
    setAmount(10)
  }

  return (
    <AuthenticatedLayout>
      <div className="p-0 bg-black min-h-screen">
        {/* Top Navigation */}
        <motion.div
          className="flex justify-between items-center p-4 border-b border-gray-800/30 bg-[#0A0A0A]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center">
            <Image src="/images/logo.png" alt="Nexus" width={32} height={32} />
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white font-medium">$450.07</div>
            <button className="p-2 rounded-full bg-[#111]">
              <User size={20} className="text-white" />
            </button>
          </div>
        </motion.div>

        {/* Main trading interface */}
        <div className="grid grid-cols-1 gap-4 p-4">
          {/* Trading pair selector and chart area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left sidebar with chart tools */}
            <div className="hidden lg:flex flex-col bg-[#0A0A0A] rounded-lg border border-gray-800/30 p-2 space-y-4">
              <motion.button
                className="p-3 rounded-md bg-[#111] hover:bg-[#1a1a1a] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/icons/dashboard.png" alt="Dashboard" width={24} height={24} />
              </motion.button>
              <motion.button
                className="p-3 rounded-md bg-[#8ECAFF] hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/icons/trade.png" alt="Trade" width={24} height={24} />
              </motion.button>
              <motion.button
                className="p-3 rounded-md bg-[#111] hover:bg-[#1a1a1a] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/icons/analytics.png" alt="Analytics" width={24} height={24} />
              </motion.button>
              <motion.button
                className="p-3 rounded-md bg-[#111] hover:bg-[#1a1a1a] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/icons/faucet.png" alt="Faucet" width={24} height={24} />
              </motion.button>
              <motion.button
                className="p-3 rounded-md bg-[#111] hover:bg-[#1a1a1a] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/icons/deposit.png" alt="Deposit" width={24} height={24} />
              </motion.button>
              <motion.button
                className="p-3 rounded-md bg-[#111] hover:bg-[#1a1a1a] transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/icons/withdraw.png" alt="Withdraw" width={24} height={24} />
              </motion.button>
              <motion.button
                className="p-3 rounded-md bg-[#111] hover:bg-[#1a1a1a] transition-colors mt-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image src="/images/icons/signout.png" alt="Sign Out" width={24} height={24} />
              </motion.button>
            </div>

            {/* Chart */}
            <div className="lg:col-span-2 bg-[#0A0A0A] rounded-lg border border-gray-800/30">
              {/* Trading pair selector */}
              <div className="flex justify-between items-center p-2 border-b border-gray-800/30">
                <div className="flex space-x-2">
                  <motion.button
                    className={`px-4 py-2 rounded-md ${
                      selectedPair.baseAsset === "SUI"
                        ? "bg-[#8ECAFF] text-black"
                        : "bg-[#0A0A0A] text-white hover:bg-[#111]"
                    }`}
                    onClick={() => handlePairChange(suiTradingPairs[0])}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    SUI
                  </motion.button>
                  <motion.button
                    className={`px-4 py-2 rounded-md ${
                      selectedPair.baseAsset === "USDT"
                        ? "bg-[#8ECAFF] text-black"
                        : "bg-[#0A0A0A] text-white hover:bg-[#111]"
                    }`}
                    onClick={() => handlePairChange(suiTradingPairs[1])}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    USDT
                  </motion.button>
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
                    className="px-4 py-2 bg-[#8ECAFF] text-black rounded-md hover:opacity-90 transition-opacity"
                    onClick={() => setShowOrderBook(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Open Order Book
                  </motion.button>
                </div>
              </div>

              {/* Chart */}
              <div className="p-0">
                {candleData.length > 0 && (
                  <CandlestickChart data={candleData} height={400} timeframe={timeframe} className="w-full" />
                )}
              </div>
            </div>

            {/* Right side - Trading Form */}
            <div className="bg-[#0A0A0A] rounded-lg border border-gray-800/30 p-4">
              {/* Long/Short buttons */}
              <div className="flex mb-4">
                <motion.button
                  className={`flex-1 py-2 rounded-l-md ${
                    tradeType === "long"
                      ? "bg-[#8ECAFF] text-black"
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
                      ? "bg-[#8ECAFF] text-black"
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

              {/* Price */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Price</span>
                  <span className="text-sm font-medium">${currentPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-400">Amount to be paid</span>
                  <span className="text-sm font-medium">0 WBTC</span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="bg-[#111] border-gray-800/30 pr-16"
                  />
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-[#8ECAFF]"
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
                  <span className="text-sm text-gray-400">Leverage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{leverage}x</span>
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
                <div className="flex justify-end mt-2 space-x-2">
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

              {/* Trade Button */}
              <motion.button
                className="w-full py-3 bg-[#111] text-white rounded-md hover:bg-[#1a1a1a] transition-colors mb-4"
                onClick={executeTrade}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Wallet Connected
              </motion.button>

              {/* Trading Parameters */}
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Order Type</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">{orderType}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Entry Price</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">-</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Current Price</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">-</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Mark Price</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">-</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Quantity</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">-</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Margin Mode</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">-</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Margin</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">-</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Margin Ratio</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">-</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-800/10">
                  <span className="text-sm text-gray-400">Estimated Liquidation Price</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-1">-</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                </div>
              </div>
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
                                <span className={order.side === "buy" ? "text-green-500" : "text-red-500"}>
                                  {order.side.toUpperCase()}
                                </span>
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
                              <span className={trade.type === "long" ? "text-green-500" : "text-red-500"}>
                                {trade.type.toUpperCase()}
                              </span>
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

        {/* Mobile Navigation */}
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 lg:hidden flex bg-[#0A0A0A] rounded-full border border-gray-800/30 p-1 z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button className="p-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Image src="/images/icons/dashboard.png" alt="Dashboard" width={20} height={20} />
          </motion.button>
          <motion.button
            className="p-2 bg-[#8ECAFF] rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Image src="/images/icons/trade.png" alt="Trade" width={20} height={20} />
          </motion.button>
          <motion.button className="p-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Image src="/images/icons/analytics.png" alt="Analytics" width={20} height={20} />
          </motion.button>
          <motion.button className="p-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Image src="/images/icons/faucet.png" alt="Faucet" width={20} height={20} />
          </motion.button>
          <motion.button className="p-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Image src="/images/icons/deposit.png" alt="Deposit" width={20} height={20} />
          </motion.button>
        </motion.div>

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
