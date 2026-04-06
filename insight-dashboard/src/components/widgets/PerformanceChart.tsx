import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TimeSeriesPoint } from "@/lib/mockData";

interface PerformanceChartProps {
  data: TimeSeriesPoint[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  return (
    <div className="bg-card rounded-sm border border-border p-4">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 12%, 26%)" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "hsl(212, 10%, 58%)", fontFamily: "IBM Plex Mono" }}
            axisLine={{ stroke: "hsl(214, 12%, 26%)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(212, 10%, 58%)", fontFamily: "IBM Plex Mono" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(215, 22%, 11%)",
              border: "1px solid hsl(214, 12%, 26%)",
              borderRadius: "2px",
              fontSize: "11px",
              fontFamily: "IBM Plex Mono",
              color: "hsl(210, 14%, 83%)",
            }}
          />
          <Area
            type="monotone"
            dataKey="cpu"
            name="CPU %"
            stroke="hsl(212, 100%, 67%)"
            fill="hsl(212, 100%, 67%)"
            fillOpacity={0.15}
            strokeWidth={1.5}
          />
          <Area
            type="monotone"
            dataKey="memory"
            name="Memory %"
            stroke="hsl(37, 90%, 55%)"
            fill="hsl(37, 90%, 55%)"
            fillOpacity={0.1}
            strokeWidth={1.5}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
