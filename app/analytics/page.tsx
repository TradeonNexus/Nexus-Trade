"use client"

import { motion } from "framer-motion"
import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function AnalyticsPage() {
  // Mock data for charts
  const performanceData = [
    { name: "Jan", pnl: 2500, winRate: 65 },
    { name: "Feb", pnl: -1200, winRate: 40 },
    { name: "Mar", pnl: 3400, winRate: 72 },
    { name: "Apr", pnl: 2800, winRate: 68 },
    { name: "May", pnl: 1900, winRate: 55 },
    { name: "Jun", pnl: 4200, winRate: 76 },
  ]

  const assetDistribution = [
    { name: "BTC", value: 45 },
    { name: "ETH", value: 30 },
    { name: "SUI", value: 15 },
    { name: "USDT", value: 10 },
  ]

  const tradingVolume = [
    { name: "Mon", volume: 12000 },
    { name: "Tue", volume: 19000 },
    { name: "Wed", volume: 14000 },
    { name: "Thu", volume: 22000 },
    { name: "Fri", volume: 16000 },
    { name: "Sat", volume: 9000 },
    { name: "Sun", volume: 5000 },
  ]

  return (
    <AuthenticatedLayout>
      <div className="p-6">
        <motion.h1
          className="text-3xl font-bold mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Analytics
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-gray-900 rounded-lg border border-gray-800 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-xl font-bold mb-4">P&L Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                    labelStyle={{ color: "#999" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="pnl" stroke="#0096FF" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="winRate" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            className="bg-gray-900 rounded-lg border border-gray-800 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4">Trading Volume</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradingVolume} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                    labelStyle={{ color: "#999" }}
                  />
                  <Legend />
                  <Bar dataKey="volume" fill="#0096FF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-gray-900 rounded-lg border border-gray-800 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold mb-4">Asset Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetDistribution} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis type="number" stroke="#666" />
                <YAxis dataKey="name" type="category" stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                  labelStyle={{ color: "#999" }}
                />
                <Legend />
                <Bar dataKey="value" fill="#0096FF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </AuthenticatedLayout>
  )
}
