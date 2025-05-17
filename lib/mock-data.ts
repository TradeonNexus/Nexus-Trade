import type { CandleData, OrderBookEntry, TradingPair } from "@/lib/types"

// Mock trading pairs
export const suiTradingPairs: TradingPair[] = [
  {
    id: "sui-usdt",
    name: "SUI/USDT",
    baseAsset: "SUI",
    quoteAsset: "USDT",
    precision: 4,
    minOrderSize: 0.01,
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
    change24h: 0.75,
  },
  {
    id: "eth-usdt",
    name: "ETH/USDT",
    baseAsset: "ETH",
    quoteAsset: "USDT",
    precision: 2,
    minOrderSize: 0.01,
    change24h: -0.32,
  },
]

// Export suiTradingPairs as mockTradingPairs for backward compatibility
export const mockTradingPairs = suiTradingPairs

// Generate mock candle data
export function generateMockCandleData(count: number, timeframe = "1h"): CandleData[] {
  const data: CandleData[] = []
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

  // Start time (now - count * timeIncrement)
  let time = Date.now() - count * timeIncrement

  // Initial price
  let price = 100 + Math.random() * 50

  for (let i = 0; i < count; i++) {
    // Random price movement
    const change = (Math.random() - 0.5) * 2 // -1 to 1
    const changePercent = change * 0.02 // Max 2% change

    const open = price
    price = price * (1 + changePercent)
    const close = price

    // High and low
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)

    // Volume
    const volume = Math.random() * 100 + 50

    data.push({
      time,
      open,
      high,
      low,
      close,
      volume,
    })

    time += timeIncrement
  }

  return data
}

// Generate mock order book
export function generateMockOrderBook(currentPrice: number): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } {
  const bids: OrderBookEntry[] = []
  const asks: OrderBookEntry[] = []

  // Generate 10 bid entries (buy orders)
  for (let i = 0; i < 10; i++) {
    const priceDrop = (i + 1) * 0.1 // Each bid is 0.1% lower than the previous
    const price = Number.parseFloat((currentPrice * (1 - priceDrop / 100)).toFixed(2))
    const total = Number.parseFloat((Math.random() * 10 + 1).toFixed(2))

    bids.push({ price, total })
  }

  // Generate 10 ask entries (sell orders)
  for (let i = 0; i < 10; i++) {
    const priceIncrease = (i + 1) * 0.1 // Each ask is 0.1% higher than the previous
    const price = Number.parseFloat((currentPrice * (1 + priceIncrease / 100)).toFixed(2))
    const total = Number.parseFloat((Math.random() * 10 + 1).toFixed(2))

    asks.push({ price, total })
  }

  // Sort bids in descending order (highest price first)
  bids.sort((a, b) => b.price - a.price)

  // Sort asks in ascending order (lowest price first)
  asks.sort((a, b) => a.price - b.price)

  return { bids, asks }
}
