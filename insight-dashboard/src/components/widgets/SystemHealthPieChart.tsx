import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useServers } from "@/hooks/useServers";

const SystemHealthPieChart = () => {
  const { servers } = useServers();
  const healthy = servers.filter(s => s.status === 'healthy').length;
  const warning = servers.filter(s => s.status === 'warning').length;
  const critical = servers.filter(s => s.status === 'critical').length;
  const offline = servers.filter(s => s.status === 'offline').length;
  
  const data = [
    { name: 'Healthy', value: healthy, color: "hsl(142, 71%, 45%)" },
    { name: 'Warning', value: warning, color: "hsl(37, 90%, 55%)" },
    { name: 'Critical', value: critical, color: "hsl(0, 84%, 60%)" },
    ...(offline > 0 ? [{ name: 'Offline', value: offline, color: "hsl(215, 14%, 34%)" }] : [])
  ].filter(d => d.value > 0);

  return (
    <div className="bg-card border border-border p-4 rounded-md flex flex-col h-full">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">System Health</h3>
      <div className="flex-1 min-h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: "hsl(215, 22%, 11%)", borderColor: "hsl(214, 12%, 26%)", fontSize: "11px", fontFamily: "IBM Plex Mono" }}
              itemStyle={{ color: "hsl(210, 14%, 83%)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SystemHealthPieChart;
