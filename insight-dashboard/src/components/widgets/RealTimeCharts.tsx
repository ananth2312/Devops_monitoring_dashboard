import { useEffect, useState } from "react";
import { fetchMetrics } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Keeping historical window size constraint
// let data: any[] = [];

const MetricChart = ({ dataKey, name, color, data }: { dataKey: string, name: string, color: string, data: Record<string, any>[] }) => (
   <div className="bg-card border border-border p-3 rounded-md flex flex-col items-center">
      <h4 className="text-[10px] uppercase font-bold text-muted-foreground w-full mb-2 tracking-wider">{name} Usage</h4>
      <div className="h-20 w-full relative -ml-2">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
               <XAxis dataKey="time" hide />
               <YAxis hide domain={[0, 100]} />
               <Tooltip 
                  contentStyle={{ backgroundColor: "hsl(215, 22%, 11%)", borderColor: "hsl(214, 12%, 26%)", fontSize: "10px", fontFamily: "IBM Plex Mono", padding: "4px" }}
               />
               <Area 
                  type="monotone" 
                  dataKey={dataKey} 
                  stroke={color} 
                  fill={color} 
                  fillOpacity={0.15} 
                  strokeWidth={1.5} 
                  isAnimationActive={false}
               />
            </AreaChart>
         </ResponsiveContainer>
      </div>
   </div>
);

const RealTimeCharts = () => {
   const [metricsData, setMetricsData] = useState<Record<string, any>[]>([]);

   useEffect(() => {
      let isMounted = true;
      const load = async () => {
         try {
            const point = await fetchMetrics();
            if (isMounted) {
               setMetricsData(prev => {
                  const copy = [...prev, point];
                  if (copy.length > 20) copy.shift();
                  return copy;
               });
            }
         } catch (e) { console.error(e); }
      };

      load(); // init fetch
      const interval = setInterval(load, 5000); // Poll backend every 5s
      return () => { isMounted = false; clearInterval(interval); };
   }, []);

   return (
      <div className="w-full">
         <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Monitoring Metrics</h3>
         <div className="grid grid-flow-row grid-cols-2 md:grid-cols-4 gap-4">
            <MetricChart data={metricsData} dataKey="cpu" name="CPU" color="hsl(212, 100%, 67%)" />
            <MetricChart data={metricsData} dataKey="memory" name="RAM" color="hsl(37, 90%, 55%)" />
            <MetricChart data={metricsData} dataKey="network" name="Network" color="hsl(280, 80%, 65%)" />
            <MetricChart data={metricsData} dataKey="requests" name="Disk I/O" color="hsl(142, 71%, 45%)" />
         </div>
      </div>
   );
};

export default RealTimeCharts;
