import type { CandleData, OrderBookEntry, TradingPair } from "./types"

// Find where suiTradingPairs is defined and make sure each pair has an id and change24h property
export const suiTradingPairs: TradingPair[] = [
  {
    id: "sui-usdt",
    name: "SUI/USDT",
    baseAsset: "SUI",
    quoteAsset: "USDT",
    precision: 4,
    minOrderSize: 0.01,
    baseAssetLogo: "/images/icons/sui.png",
    change24h: 2.45,
  },
  {
    id: "usdt-sui",
    name: "USDT/SUI",
    baseAsset: "USDT",
    quoteAsset: "SUI",
    precision: 4,
    minOrderSize: 0.01,
    change24h: -1.23,
  },
  {
    id: "btc-usdt",
    name: "BTC/USDT",
    baseAsset: "BTC",
    quoteAsset: "USDT",
    precision: 2,
    minOrderSize: 0.001,
    change24h: 3.75,
  },
  {
    id: "eth-usdt",
    name: "ETH/USDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    precision: 2,
    minOrderSize: 0.01,
    change24h: 1.89,
  },
]

// Generate mock candle data
export function generateMockCandleData(count = 100, timeframe = "1h"): CandleData[] {
  const now = new Date().getTime()
  let timeIncrement: number

  // Set time increment based on timeframe
  switch (timeframe) {
    case "1m":
      timeIncrement = 60 * 1000 // 1 minute
      break
    case "5m":
      timeIncrement = 5 * 60 * 1000 // 5 minutes
      break
    case "15m":
      timeIncrement = 15 * 60 * 1000 // 15 minutes
      break
    case "1h":
      timeIncrement = 60 * 60 * 1000 // 1 hour
      break
    case "4h":
      timeIncrement = 4 * 60 * 60 * 1000 // 4 hours
      break
    case "1d":
      timeIncrement = 24 * 60 * 60 * 1000 // 1 day
      break
    default:
      timeIncrement = 60 * 60 * 1000 // Default to 1 hour
  }

  // Start price
  let lastClose = 128.2
  let trend = 0
  let trendStrength = 0
  let trendDuration = 0

  return Array.from({ length: count }).map((_, i) => {
    // Update trend occasionally
    if (trendDuration <= 0) {
      trend = Math.random() > 0.5 ? 1 : -1
      trendStrength = Math.random() * 0.02
      trendDuration = Math.floor(Math.random() * 15) + 5
    }
    trendDuration--

    // Calculate price movement with trend bias
    const change = (Math.random() - 0.5) * 0.02 + trend * trendStrength
    const open = lastClose
    const close = open * (1 + change)
    const high = Math.max(open, close) * (1 + Math.random() * 0.005)
    const low = Math.min(open, close) * (1 - Math.random() * 0.005)
    const volume = Math.random() * 100 + 50

    // Save close price for next candle
    lastClose = close

    return {
      time: now - (count - i) * timeIncrement,
      open,
      high,
      low,
      close,
      volume,
    }
  })
}

// Generate mock order book
export function generateMockOrderBook(currentPrice: number): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } {
  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []

  // Generate bids (buy orders) - slightly below current price
  for (let i = 0; i < 12; i++) {
    const priceDelta = (Math.random() * 0.05 + 0.001) * (i + 1)
    const price = Number.parseFloat((currentPrice * (1 - priceDelta / 100)).toFixed(2))
    const total = Number.parseFloat((Math.random() * 15 + 1).toFixed(2))
    bids.push({ price, total })
  }

  // Sort bids in descending order (highest buy price first)
  bids.sort((a, b) => b.price - a.price)

  // Generate asks (sell orders) - slightly above current price
  for (let i = 0; i < 12; i++) {
    const priceDelta = (Math.random() * 0.05 + 0.001) * (i + 1)
    const price = Number.parseFloat((currentPrice * (1 + priceDelta / 100)).toFixed(2))
    const total = Number.parseFloat((Math.random() * 15 + 1).toFixed(2))
    asks.push({ price, total })
  }

  // Sort asks in ascending order (lowest sell price first)
  asks.sort((a, b) => a.price - b.price)

  return { bids, asks }
}
