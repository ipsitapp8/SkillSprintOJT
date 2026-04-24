"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface PerformancePoint {
  testTitle: string
  score: number
  percentage: number
  date: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="border border-panel-border bg-deep-bg/95 backdrop-blur-sm px-4 py-3">
      <p className="font-mono text-[10px] tracking-wider text-neon-cyan mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="font-mono text-[11px] text-foreground">
          {entry.name}: <span className="text-neon-cyan font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  )
}

// Fallback dummy data when no real performance data exists
const fallbackData = [
  { name: "—", score: 0, percentage: 0 },
]

export function PerformanceChart({ data }: { data?: PerformancePoint[] }) {
  const chartData = data && data.length > 0
    ? data.map((p, i) => ({
        name: p.testTitle.length > 12 ? p.testTitle.slice(0, 12) + '…' : p.testTitle,
        score: p.score,
        percentage: p.percentage,
      }))
    : fallbackData

  const hasData = data && data.length > 0

  if (!hasData) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-panel-border">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          COMPLETE TESTS TO SEE YOUR PERFORMANCE TREND
        </span>
      </div>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e2035"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="#6b6b8a"
            fontSize={10}
            fontFamily="monospace"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b6b8a"
            fontSize={10}
            fontFamily="monospace"
            tickLine={false}
            axisLine={false}
            domain={[0, "dataMax + 10"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            name="Score"
            stroke="#00f0ff"
            strokeWidth={2}
            fill="url(#scoreGradient)"
            dot={{ fill: "#00f0ff", strokeWidth: 0, r: 3 }}
            activeDot={{ fill: "#00f0ff", strokeWidth: 0, r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
