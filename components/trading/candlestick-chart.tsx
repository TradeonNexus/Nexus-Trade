"use client"

import { useEffect, useRef, useState } from "react"
import { createChart, ColorType, CrosshairMode, LineStyle } from "lightweight-charts"
import type { CandleData } from "@/lib/types"
import { motion } from "framer-motion"
import { Pencil, MousePointer, TrendingUp, Trash2, ChevronDown } from "lucide-react"

interface CandlestickChartProps {
  data: CandleData[]
  width?: number
  height?: number
  className?: string
  timeframe?: string
}

export function CandlestickChart({
  data,
  width = 600,
  height = 400,
  className = "",
  timeframe = "1h",
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const seriesRef = useRef<any>(null)
  const drawingRef = useRef<any>(null)
  const [activeIndicators, setActiveIndicators] = useState<string[]>([])
  const [showIndicatorMenu, setShowIndicatorMenu] = useState(false)
  const [drawingMode, setDrawingMode] = useState<string | null>(null)
  const [drawings, setDrawings] = useState<any[]>([])

  // Available indicators
  const indicators = [
    { id: "ma", name: "Moving Average", color: "#FFA500" },
    { id: "ema", name: "EMA", color: "#FF00FF" },
    { id: "rsi", name: "RSI", color: "#00FFFF" },
    { id: "bb", name: "Bollinger Bands", color: "#FFFF00" },
  ]

  useEffect(() => {
    if (!chartContainerRef.current) return

    // Clean up previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    // Create chart with TradingView-like appearance
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#D9D9D9",
        fontSize: 12,
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0.2)",
          style: LineStyle.Dotted,
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.2)",
          style: LineStyle.Dotted,
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "rgba(255, 255, 255, 0.4)",
          width: 1,
          style: LineStyle.Solid,
          labelBackgroundColor: "#0096FF",
        },
        horzLine: {
          color: "rgba(255, 255, 255, 0.4)",
          width: 1,
          style: LineStyle.Solid,
          labelBackgroundColor: "#0096FF",
        },
      },
      timeScale: {
        borderColor: "rgba(42, 46, 57, 0.2)",
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000)
          const hours = date.getHours().toString().padStart(2, "0")
          const minutes = date.getMinutes().toString().padStart(2, "0")
          return `${hours}:${minutes}`
        },
      },
      rightPriceScale: {
        borderColor: "rgba(42, 46, 57, 0.2)",
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      handleScroll: {
        vertTouchDrag: true,
      },
      // Remove watermark
      watermark: {
        visible: false,
      },
    })

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    })

    // Format data for the chart
    const formattedData = data.map((candle) => ({
      time: candle.time / 1000, // Convert milliseconds to seconds
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }))

    // Set data and fit content
    candlestickSeries.setData(formattedData)
    chart.timeScale().fitContent()

    // Save references
    chartRef.current = chart
    seriesRef.current = candlestickSeries

    // Add resize listener
    window.addEventListener("resize", handleResize)

    // Setup drawing tools
    setupDrawingTools(chart, formattedData)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
      }
    }
  }, [height, timeframe])

  // Update data when it changes
  useEffect(() => {
    if (!seriesRef.current || data.length === 0) return

    const formattedData = data.map((candle) => ({
      time: candle.time / 1000, // Convert milliseconds to seconds
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }))

    seriesRef.current.setData(formattedData)

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }

    // Update indicators
    updateIndicators(formattedData)
  }, [data, activeIndicators])

  // Setup drawing tools
  const setupDrawingTools = (chart: any, formattedData: any[]) => {
    if (!chartContainerRef.current) return

    // Initialize drawing state
    drawingRef.current = {
      isDrawing: false,
      startPoint: null,
      currentLine: null,
    }

    // Add mouse event listeners for drawing
    chartContainerRef.current.addEventListener("mousedown", (e) => {
      if (!drawingMode) return

      const rect = chartContainerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Convert pixel coordinates to price and time
      const price = chart.priceScale("right").coordinateToPrice(y)
      const time = chart.timeScale().coordinateToTime(x)

      if (time && price) {
        drawingRef.current.isDrawing = true
        drawingRef.current.startPoint = { time, price }

        if (drawingMode === "trendline") {
          // Create a new line series
          const lineSeries = chart.addLineSeries({
            color: "#8ECAFF",
            lineWidth: 2,
            lastValueVisible: false,
            priceLineVisible: false,
          })

          // Initial line with just the start point
          lineSeries.setData([
            { time, value: price },
            { time, value: price },
          ])

          drawingRef.current.currentLine = lineSeries
        }
      }
    })

    chartContainerRef.current.addEventListener("mousemove", (e) => {
      if (!drawingRef.current.isDrawing || !drawingMode) return

      const rect = chartContainerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Convert pixel coordinates to price and time
      const price = chart.priceScale("right").coordinateToPrice(y)
      const time = chart.timeScale().coordinateToTime(x)

      if (time && price && drawingRef.current.currentLine) {
        // Update the end point of the line
        drawingRef.current.currentLine.setData([
          { time: drawingRef.current.startPoint.time, value: drawingRef.current.startPoint.price },
          { time, value: price },
        ])
      }
    })

    chartContainerRef.current.addEventListener("mouseup", (e) => {
      if (!drawingRef.current.isDrawing || !drawingMode) return

      const rect = chartContainerRef.current!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Convert pixel coordinates to price and time
      const price = chart.priceScale("right").coordinateToPrice(y)
      const time = chart.timeScale().coordinateToTime(x)

      if (time && price && drawingRef.current.currentLine) {
        // Finalize the line
        drawingRef.current.currentLine.setData([
          { time: drawingRef.current.startPoint.time, value: drawingRef.current.startPoint.price },
          { time, value: price },
        ])

        // Add to drawings list
        setDrawings((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: drawingMode,
            series: drawingRef.current.currentLine,
            points: [
              { time: drawingRef.current.startPoint.time, value: drawingRef.current.startPoint.price },
              { time, value: price },
            ],
          },
        ])

        // Reset drawing state
        drawingRef.current.isDrawing = false
        drawingRef.current.startPoint = null
        drawingRef.current.currentLine = null
        setDrawingMode(null)
      }
    })
  }

  // Update indicators
  const updateIndicators = (formattedData: any[]) => {
    if (!chartRef.current) return

    // Remove existing indicators
    const existingIndicators = chartRef.current.getAllSeries().filter((s: any) => s.options().type !== "Candlestick")
    existingIndicators.forEach((series: any) => {
      chartRef.current.removeSeries(series)
    })

    // Add active indicators
    activeIndicators.forEach((id) => {
      const indicator = indicators.find((i) => i.id === id)
      if (!indicator) return

      switch (id) {
        case "ma":
          // Simple Moving Average (20 periods)
          const maSeries = chartRef.current.addLineSeries({
            color: indicator.color,
            lineWidth: 2,
            title: "MA (20)",
          })

          // Calculate MA values
          const maData = formattedData
            .map((candle, index, array) => {
              if (index < 19) return null // Not enough data for 20-period MA

              // Calculate average of last 20 closes
              const sum = array.slice(index - 19, index + 1).reduce((acc, val) => acc + val.close, 0)
              const ma = sum / 20

              return {
                time: candle.time,
                value: ma,
              }
            })
            .filter(Boolean) // Remove null values

          maSeries.setData(maData)
          break

        case "ema":
          // Exponential Moving Average (12 periods)
          const emaSeries = chartRef.current.addLineSeries({
            color: indicator.color,
            lineWidth: 2,
            title: "EMA (12)",
          })

          // Calculate EMA values
          const k = 2 / (12 + 1) // Smoothing factor
          let ema = formattedData[0]?.close || 0
          const emaData = formattedData.map((candle) => {
            ema = candle.close * k + ema * (1 - k)
            return {
              time: candle.time,
              value: ema,
            }
          })

          emaSeries.setData(emaData)
          break

        case "bb":
          // Bollinger Bands (20 periods, 2 standard deviations)
          const upperBandSeries = chartRef.current.addLineSeries({
            color: indicator.color,
            lineWidth: 1,
            lineStyle: LineStyle.Dashed,
            title: "Upper BB",
          })

          const middleBandSeries = chartRef.current.addLineSeries({
            color: indicator.color,
            lineWidth: 1,
            title: "Middle BB",
          })

          const lowerBandSeries = chartRef.current.addLineSeries({
            color: indicator.color,
            lineWidth: 1,
            lineStyle: LineStyle.Dashed,
            title: "Lower BB",
          })

          // Calculate Bollinger Bands
          const bbData = formattedData
            .map((candle, index, array) => {
              if (index < 19) return null // Not enough data

              // Calculate SMA
              const slice = array.slice(index - 19, index + 1)
              const closes = slice.map((c) => c.close)
              const sma = closes.reduce((a, b) => a + b, 0) / 20

              // Calculate standard deviation
              const squaredDiffs = closes.map((close) => Math.pow(close - sma, 2))
              const variance = squaredDiffs.reduce((a, b) => a + b, 0) / 20
              const stdDev = Math.sqrt(variance)

              // Calculate bands
              const upperBand = sma + 2 * stdDev
              const lowerBand = sma - 2 * stdDev

              return {
                time: candle.time,
                sma,
                upper: upperBand,
                lower: lowerBand,
              }
            })
            .filter(Boolean)

          upperBandSeries.setData(bbData.map((d: any) => ({ time: d.time, value: d.upper })))
          middleBandSeries.setData(bbData.map((d: any) => ({ time: d.time, value: d.sma })))
          lowerBandSeries.setData(bbData.map((d: any) => ({ time: d.time, value: d.lower })))
          break

        case "rsi":
          // RSI (14 periods)
          // Create a separate pane for RSI
          const rsiPane = chartRef.current.addLineSeries({
            color: indicator.color,
            lineWidth: 2,
            title: "RSI (14)",
            priceScaleId: "rsi",
            pane: 1,
          })

          chartRef.current.applyOptions({
            priceScale: {
              rsi: {
                scaleMargins: {
                  top: 0.8,
                  bottom: 0,
                },
                visible: true,
              },
            },
          })

          // Calculate RSI
          const rsiPeriod = 14
          const rsiData = []
          let gains = 0
          let losses = 0

          for (let i = 1; i < formattedData.length; i++) {
            const change = formattedData[i].close - formattedData[i - 1].close
            if (change >= 0) {
              gains += change
            } else {
              losses -= change
            }

            if (i >= rsiPeriod) {
              // Calculate RSI
              const avgGain = gains / rsiPeriod
              const avgLoss = losses / rsiPeriod
              const rs = avgLoss === 0 ? 0 : avgGain / avgLoss
              const rsi = 100 - 100 / (1 + rs)

              rsiData.push({
                time: formattedData[i].time,
                value: rsi,
              })

              // Update for next iteration
              const oldChange = formattedData[i - rsiPeriod + 1].close - formattedData[i - rsiPeriod].close
              if (oldChange >= 0) {
                gains -= oldChange
              } else {
                losses += oldChange
              }
            }
          }

          rsiPane.setData(rsiData)
          break
      }
    })
  }

  // Toggle indicator
  const toggleIndicator = (id: string) => {
    setActiveIndicators((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Clear all drawings
  const clearDrawings = () => {
    drawings.forEach((drawing) => {
      if (chartRef.current) {
        chartRef.current.removeSeries(drawing.series)
      }
    })
    setDrawings([])
  }

  return (
    <div className="relative">
      {/* Chart Container */}
      <motion.div
        ref={chartContainerRef}
        className={`w-full ${className}`}
        style={{ height }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* Drawing Tools */}
      <div className="absolute top-2 left-2 flex space-x-1 z-10">
        <motion.button
          className={`p-1.5 rounded-md ${drawingMode === null ? "bg-[#8ECAFF] text-black" : "bg-[#111] text-white"}`}
          onClick={() => setDrawingMode(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MousePointer size={16} />
        </motion.button>
        <motion.button
          className={`p-1.5 rounded-md ${
            drawingMode === "trendline" ? "bg-[#8ECAFF] text-black" : "bg-[#111] text-white"
          }`}
          onClick={() => setDrawingMode("trendline")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <TrendingUp size={16} />
        </motion.button>
        <motion.button
          className="p-1.5 rounded-md bg-[#111] text-white"
          onClick={clearDrawings}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 size={16} />
        </motion.button>
      </div>

      {/* Indicators */}
      <div className="absolute top-2 right-2 z-10">
        <div className="relative">
          <motion.button
            className="p-1.5 rounded-md bg-[#111] text-white flex items-center"
            onClick={() => setShowIndicatorMenu(!showIndicatorMenu)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Pencil size={16} />
            <span className="ml-1 text-xs">Indicators</span>
            <ChevronDown size={14} className="ml-1" />
          </motion.button>

          {showIndicatorMenu && (
            <motion.div
              className="absolute right-0 mt-1 bg-[#111] border border-gray-800 rounded-md shadow-lg p-2 w-48"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {indicators.map((indicator) => (
                <div key={indicator.id} className="flex items-center p-1">
                  <input
                    type="checkbox"
                    id={`indicator-${indicator.id}`}
                    checked={activeIndicators.includes(indicator.id)}
                    onChange={() => toggleIndicator(indicator.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`indicator-${indicator.id}`} className="text-sm flex items-center">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: indicator.color }}></span>
                    {indicator.name}
                  </label>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
