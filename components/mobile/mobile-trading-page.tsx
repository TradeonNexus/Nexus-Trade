"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/contexts/wallet-context"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { generateMockCandleData, generateMockOrderBook } from "@/lib/mock-data"
import type { CandleData, OrderBook as OrderBookType, Token } from "@/lib/types"

export default function MobileTradingPage() {
  const { wallet, connectWallet } = useWallet()
  const router = useRouter()

  // State for UI views
  const [activeView, setActiveView] = useState<"chart" | "orderbook">("chart")
  const [tradeType, setTradeType] = useState<"long" | "short">("long")
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [activeTab, setActiveTab] = useState<"positions" | "orders" | "history">("positions")
  const [amount, setAmount] = useState<string>("0.00")
  const [leverage, setLeverage] = useState<number>(5)
  const [selectedToken, setSelectedToken] = useState<Token>("WBTC")

  // Modal states
  const [showConnectWallet, setShowConnectWallet] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  // Data states
  const [currentPrice, setCurrentPrice] = useState<number>(150.99)
  const [candleData, setCandleData] = useState<CandleData[]>([])
  const [orderBook, setOrderBook] = useState<OrderBookType>({ bids: [], asks: [] })

  // Load initial data
  useEffect(() => {
    // Generate mock data
    const mockCandles = generateMockCandleData(50, "1h")
    setCandleData(mockCandles)

    // Set current price from the last candle
    if (mockCandles.length > 0) {
      setCurrentPrice(Number(mockCandles[mockCandles.length - 1].close.toFixed(2)))
    }

    // Generate order book
    setOrderBook(generateMockOrderBook(currentPrice))

    // Simulate price updates
    const interval = setInterval(() => {
      setCurrentPrice((prev) => {
        const change = (Math.random() - 0.5) * 0.5
        return Number((prev + change).toFixed(2))
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Update order book when price changes
  useEffect(() => {
    setOrderBook(generateMockOrderBook(currentPrice))
  }, [currentPrice])

  const handleConnectWallet = async (type: string) => {
    try {
      await connectWallet(type as any)
      setShowConnectWallet(false)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const handleMaxAmount = () => {
    setAmount("250.00")
  }

  const getEstimatedLiquidationPrice = () => {
    if (tradeType === "long") {
      return (currentPrice * (1 - 0.9 / leverage)).toFixed(2)
    } else {
      return (currentPrice * (1 + 0.9 / leverage)).toFixed(2)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Top navigation */}
      <div className="p-4">
        <Link href="/" className="inline-block">
          <div className="w-8 h-8">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z"
                fill="black"
              />
              <path d="M28.3952 7.5999L18.8507 17.1443L30.0001 28.2937L7.60474 7.5999H28.3952Z" fill="#0096FF" />
              <path d="M6 8.7999L12.4018 15.2017L6 28.7999V8.7999Z" fill="#0096FF" />
            </svg>
          </div>
        </Link>
      </div>

      {/* View toggle */}
      <div className="flex px-4 gap-2 mb-2">
        <button
          className={`py-3 flex-1 rounded-lg text-center font-medium ${activeView === "chart" ? "bg-[#87A9C0] text-black" : "bg-black border border-gray-800 text-white"}`}
          onClick={() => setActiveView("chart")}
        >
          Chart
        </button>
        <button
          className={`py-3 flex-1 rounded-lg text-center font-medium ${activeView === "orderbook" ? "bg-[#87A9C0] text-black" : "bg-black border border-gray-800 text-white"}`}
          onClick={() => setActiveView("orderbook")}
        >
          Order Book
        </button>
      </div>

      {/* Long/Short toggle */}
      <div className="flex px-4 gap-2 mb-6">
        <button
          className={`py-3 flex-1 rounded-lg text-center font-medium ${tradeType === "long" ? "bg-[#87A9C0] text-black" : "bg-black border border-gray-800 text-white"}`}
          onClick={() => setTradeType("long")}
        >
          Long <span className="ml-1">↗</span>
        </button>
        <button
          className={`py-3 flex-1 rounded-lg text-center font-medium ${tradeType === "short" ? "bg-[#FF453A] text-black" : "bg-black border border-gray-800 text-white"}`}
          onClick={() => setTradeType("short")}
        >
          Short <span className="ml-1">↘</span>
        </button>
      </div>

      {/* Market/Limit toggle and price */}
      <div className="flex px-4 items-center mb-6">
        <button
          className={`py-2 px-4 rounded-lg text-center text-sm ${orderType === "market" ? "bg-[#001C30] text-white" : "bg-transparent text-gray-400"}`}
          onClick={() => setOrderType("market")}
        >
          Market
        </button>
        <button
          className={`py-2 px-4 rounded-lg text-center text-sm ${orderType === "limit" ? "bg-[#001C30] text-white" : "bg-transparent text-gray-400"}`}
          onClick={() => setOrderType("limit")}
        >
          Limit
        </button>
        <div className="ml-auto py-2 px-4 rounded-lg bg-black border border-gray-800 text-white">${currentPrice}</div>
      </div>

      {/* Main View Content */}
      <div className="px-4 mb-6">
        {activeView === "chart" ? (
          <div className="flex-grow">
            {/* Simple mobile chart representation */}
            <div className="h-60 w-full bg-black border border-gray-800 rounded-md overflow-hidden relative">
              {candleData.length > 0 ? (
                <div className="h-full w-full relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full text-xs text-gray-400 flex flex-col justify-between py-2">
                    <div>132</div>
                    <div>130</div>
                    <div>128</div>
                    <div>126</div>
                    <div>124</div>
                    <div>122</div>
                    <div>120</div>
                  </div>

                  {/* Grid lines */}
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-6">
                    {Array(24)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="border-t border-l border-gray-800"></div>
                      ))}
                  </div>

                  {/* Price markers */}
                  <div className="absolute right-2 top-1/3 text-green-500 text-sm">129.4</div>
                  <div className="absolute left-12 top-2/3 text-red-500 text-sm">128.2</div>

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-4">
                    <div>0</div>
                    <div>06:00</div>
                    <div>18:00</div>
                    <div>06:00</div>
                    <div>18:00</div>
                    <div>06:00</div>
                  </div>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-400">Loading chart...</p>
                </div>
              )}
            </div>

            {/* Positions/Orders/History tabs */}
            <div className="mt-4 border border-gray-800 rounded-md overflow-hidden">
              <div className="flex border-b border-gray-800 bg-black">
                <button
                  className={`flex-1 py-2 px-4 text-sm ${activeTab === "positions" ? "border-b-2 border-white" : "text-gray-400"}`}
                  onClick={() => setActiveTab("positions")}
                >
                  Positions
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-sm ${activeTab === "orders" ? "border-b-2 border-white" : "text-gray-400"}`}
                  onClick={() => setActiveTab("orders")}
                >
                  Open Orders
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-sm ${activeTab === "history" ? "border-b-2 border-white" : "text-gray-400"}`}
                  onClick={() => setActiveTab("history")}
                >
                  History
                </button>
              </div>
              <div className="p-4 text-center text-gray-400 text-sm">No positions yet</div>
            </div>
          </div>
        ) : (
          <div className="flex-grow">
            {/* Order Book View */}
            <div className="text-sm mb-4">Order Book</div>
            <div className="border border-gray-800 rounded-md overflow-hidden">
              <div className="grid grid-cols-4 border-b border-gray-800 text-xs text-gray-400 p-2">
                <div className="col-span-2">Total (HYPE)</div>
                <div className="col-span-2">Price</div>
              </div>

              {/* Order book entries */}
              <div className="max-h-96 overflow-y-auto">
                {orderBook.bids.map((bid, index) => (
                  <div key={`bid-${index}`} className="grid grid-cols-4 text-xs p-2 border-b border-gray-700/30">
                    <div className="col-span-2">{bid.total.toFixed(2)}</div>
                    <div className="col-span-2 text-green-500">{bid.price.toFixed(2)}</div>
                  </div>
                ))}

                {orderBook.asks.map((ask, index) => (
                  <div key={`ask-${index}`} className="grid grid-cols-4 text-xs p-2 border-b border-gray-700/30">
                    <div className="col-span-2">{ask.total.toFixed(2)}</div>
                    <div className="col-span-2 text-red-500">{ask.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Amount row */}
      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Amount to be paid</span>
          <span className="text-sm flex items-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <rect width="24" height="24" rx="12" fill="#1A1A1A" />
              <path
                d="M7 12H17M12 7V17"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {amount === "0.00" ? "0" : amount} {selectedToken}
          </span>
        </div>

        {/* Token selection */}
        <div className="flex gap-2 mb-2">
          <button
            className={`py-2 px-4 rounded-md ${selectedToken === "WBTC" ? "bg-[#1A1A1A] text-white" : "bg-[#1A1A1A] text-gray-400"}`}
            onClick={() => setSelectedToken("WBTC")}
          >
            WBTC
          </button>
          <button
            className={`py-2 px-4 rounded-md ${selectedToken === "ETH" ? "bg-[#1A1A1A] text-white" : "bg-[#1A1A1A] text-gray-400"}`}
            onClick={() => setSelectedToken("ETH")}
          >
            ETH
          </button>
          <button
            className={`py-2 px-4 rounded-md ${selectedToken === "SUI" ? "bg-[#1A1A1A] text-white" : "bg-[#1A1A1A] text-gray-400"}`}
            onClick={() => setSelectedToken("SUI")}
          >
            SUI
          </button>

          <div className="ml-auto flex flex-col items-end">
            <div className="text-xl font-bold">0.00</div>
            <button className="text-xs text-gray-400" onClick={handleMaxAmount}>
              MAX
            </button>
          </div>
        </div>
      </div>

      {/* Leverage slider */}
      <div className="px-4 mb-6">
        <div className="text-sm text-gray-400 mb-2">Leverage</div>
        <div className="flex items-center">
          <span className="text-sm mr-2">1x</span>
          <Slider
            value={[leverage]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => setLeverage(value[0])}
            className="flex-1"
          />
          <span className="text-sm ml-2">10x</span>
          <span className="ml-5 text-sm p-1 px-3 rounded-md bg-[#1A1A1A]">{leverage}x</span>
        </div>
      </div>

      {/* Connect Wallet button */}
      <div className="px-4 mb-6">
        <button
          className={`w-full py-4 rounded-lg font-medium ${wallet?.connected ? "bg-black border border-gray-800 text-gray-400" : tradeType === "short" ? "bg-[#FF453A] text-black" : "bg-[#87A9C0] text-black"}`}
          onClick={() => setShowConnectWallet(true)}
          disabled={wallet?.connected}
        >
          {wallet?.connected ? "Wallet Connected" : "Connect Wallet"}
        </button>
      </div>

      {/* Trade info */}
      <div className="px-4 bg-[#0A0A0A] rounded-lg border border-gray-800/30 mx-4 mb-6">
        <div className="py-3 flex justify-between border-b border-gray-800/30">
          <span className="text-gray-400 text-sm">Entry Price</span>
          <span className="text-sm">-</span>
        </div>
        <div className="py-3 flex justify-between border-b border-gray-800/30">
          <span className="text-gray-400 text-sm">Liquidation Price</span>
          <span className="text-sm">-</span>
        </div>
        <div className="py-3 flex justify-between border-b border-gray-800/30">
          <span className="text-gray-400 text-sm">Open Fee(0.06%)</span>
          <span className="text-sm">-</span>
        </div>
        <div className="py-3 flex justify-between border-b border-gray-800/30">
          <span className="text-gray-400 text-sm">Price Impact</span>
          <span className="text-sm">-</span>
        </div>
        <div className="py-3 flex justify-between border-b border-gray-800/30">
          <span className="text-gray-400 text-sm">Borrow Fees Due</span>
          <span className="text-sm">-</span>
        </div>
        <div className="py-3 flex justify-between border-b border-gray-800/30">
          <span className="text-gray-400 text-sm">Transaction Fee</span>
          <span className="text-sm">-</span>
        </div>
        <div className="py-3 flex justify-between">
          <span className="text-gray-400 text-sm">Account Rent</span>
          <span className="text-sm">-</span>
        </div>
      </div>

      {/* Connect Wallet Modal */}
      <AnimatePresence>
        {showConnectWallet && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] rounded-xl w-[90%] max-w-md overflow-hidden"
            >
              <div className="p-6 relative">
                <h2 className="text-xl font-semibold mb-6 text-center">Connect Wallet</h2>
                <button
                  className="absolute right-4 top-4 text-gray-500 hover:text-white"
                  onClick={() => setShowConnectWallet(false)}
                >
                  <X size={20} />
                </button>

                <div className="space-y-4">
                  <button
                    className="w-full py-3 px-4 bg-[#87A9C0] text-black rounded-lg font-medium"
                    onClick={() => handleConnectWallet("sui")}
                  >
                    Connect SUI Wallet
                  </button>
                  <button
                    className="w-full py-3 px-4 bg-black text-white border border-gray-800 rounded-lg font-medium"
                    onClick={() => handleConnectWallet("stashed")}
                  >
                    Connect Stashed
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] rounded-xl w-[90%] max-w-md overflow-hidden"
            >
              <div className="p-6 relative">
                <h2 className="text-xl font-semibold mb-6">Deposit Funds</h2>
                <button
                  className="absolute right-4 top-4 text-gray-500 hover:text-white"
                  onClick={() => setShowDepositModal(false)}
                >
                  <X size={20} />
                </button>

                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-4">Amount to be deposited</p>
                  <div className="flex items-center justify-between mb-4">
                    <button className="py-2 px-4 bg-[#1A1A1A] text-white rounded-md">TUSDC</button>
                    <div className="text-2xl font-bold">0.00</div>
                  </div>
                </div>

                <button
                  className="w-full py-3 px-4 bg-[#87A9C0] text-black rounded-lg font-medium"
                  onClick={() => setShowDepositModal(false)}
                >
                  Deposit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0A0A0A] rounded-xl w-[90%] max-w-md overflow-hidden"
            >
              <div className="p-6 relative">
                <h2 className="text-xl font-semibold mb-6">Withdraw Funds</h2>
                <button
                  className="absolute right-4 top-4 text-gray-500 hover:text-white"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  <X size={20} />
                </button>

                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-4">Amount to be withdrawn</p>
                  <div className="flex space-x-2 mb-4">
                    <button className="py-2 px-4 bg-[#1A1A1A] text-white rounded-md">WBTC</button>
                    <button className="py-2 px-4 bg-[#1A1A1A] text-gray-400 rounded-md">ETH</button>
                    <button className="py-2 px-4 bg-[#1A1A1A] text-gray-400 rounded-md">SUI</button>
                    <div className="ml-auto text-2xl font-bold">0.00</div>
                  </div>
                </div>

                <button
                  className="w-full py-3 px-4 bg-[#87A9C0] text-black rounded-lg font-medium"
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Withdraw
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
