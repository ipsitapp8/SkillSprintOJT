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

const data = [
  { day: "MON", rating: 1280, accuracy: 72, speed: 2.8 },
  { day: "TUE", rating: 1305, accuracy: 78, speed: 2.5 },
  { day: "WED", rating: 1290, accuracy: 65, speed: 3.1 },
  { day: "THU", rating: 1320, accuracy: 82, speed: 2.2 },
  { day: "FRI", rating: 1338, accuracy: 80, speed: 2.4 },
  { day: "SAT", rating: 1355, accuracy: 85, speed: 2.1 },
  { day: "SUN", rating: 1347, accuracy: 78, speed: 2.3 },
]

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

export function PerformanceChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="day"
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
            domain={["dataMin - 20", "dataMax + 20"]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="rating"
            name="Rating"
            stroke="#00f0ff"
            strokeWidth={2}
            fill="url(#ratingGradient)"
            dot={{ fill: "#00f0ff", strokeWidth: 0, r: 3 }}
            activeDot={{ fill: "#00f0ff", strokeWidth: 0, r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
