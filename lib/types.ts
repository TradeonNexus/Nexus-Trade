export type WalletType = "sui" | "stashed" | "other"

export type Token = "WBTC" | "ETH" | "SUI" | "USDC" | "USDT" | "TUSDC" | "CETUS" | "TURBOS" | "AFT"

export interface WalletInfo {
  address: string
  balance: Record<Token, number>
  connected: boolean
  type: WalletType
}

// Trading pair type
export interface TradingPair {
  id: string
  name: string
  baseAsset: string
  quoteAsset: string
  precision: number
  minOrderSize: number
  baseAssetLogo?: string
  change24h?: number // Make it optional with ?
}

// Candle data type for charts
export interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Order book entry type
export interface OrderBookEntry {
  price: number
  total: number
}

// OrderBook type
export interface OrderBook {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

// Position type
export type PositionType = "long" | "short"

export interface Position {
  id: string
  pair: string
  type: "long" | "short"
  entryPrice: number
  markPrice: number
  leverage: number
  size: number
  margin: number
  liquidationPrice: number
  stopLoss: number | null
  takeProfit: number | null
  pnl: number
  pnlPercentage: number
  timestamp: number
  _shouldClose?: boolean
  _closeReason?: string | null
}

// Order type
export type OrderType = "market" | "limit"
export type OrderStatus = "open" | "filled" | "canceled"
export type OrderSide = "buy" | "sell"

export interface Order {
  id: string
  pair: string
  orderType: "market" | "limit"
  side: "buy" | "sell"
  price: number
  amount: number
  filled: number
  status: "open" | "filled" | "canceled"
  timestamp: number
}

// Trade history type
export interface TradeHistory {
  id: string
  pair?: string
  type: "long" | "short"
  price: number
  size: number
  fee: number
  timestamp: number
  action: "open" | "close"
  pnl?: number
}

export interface PriceAlertData {
  id: string
  pair: string
  price: number
  condition: "above" | "below"
  createdAt: Date
  isActive: boolean
}
