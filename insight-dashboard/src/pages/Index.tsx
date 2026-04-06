import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import TopMetricsOverview from "@/components/widgets/TopMetricsOverview";
import SystemHealthPieChart from "@/components/widgets/SystemHealthPieChart";
import InfrastructureMap from "@/components/widgets/InfrastructureMap";
import UptimeWidget from "@/components/widgets/UptimeWidget";
import RealTimeCharts from "@/components/widgets/RealTimeCharts";
import AlertsPanel from "@/components/widgets/AlertsPanel";
import ServerCard from "@/components/widgets/ServerCard";
import { Server } from "@/lib/mockData";
import { useServers } from "@/hooks/useServers";
import { Activity } from "lucide-react";

const Index = () => {
  const { servers, isLoading } = useServers();
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (servers.length > 0 && !selectedServer) setSelectedServer(servers[0]);
  }, [servers, selectedServer]);

  // Auto Health Check Indicator Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsChecking(true);
      setTimeout(() => setIsChecking(false), 2000); // Simulate check taking 2 seconds
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex h-full bg-background overflow-hidden">
        {/* Main Dashboard Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header Row */}
          <div className="px-6 py-4 border-b border-border bg-sidebar/50 shrink-0 flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-wider text-foreground">Infrastructure Overview</h1>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-colors ${
              isChecking ? "border-primary/50 bg-primary/10 text-primary" : "border-border shadow-sm text-muted-foreground"
            }`}>
              <Activity className={`w-3.5 h-3.5 ${isChecking ? "animate-spin text-primary" : ""}`} />
              <span className="text-[10px] font-mono tracking-wider uppercase font-semibold">
                {isChecking ? "Running Diagnostics..." : "Auto Monitor: Active"}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <TopMetricsOverview />

            {/* Middle Section: Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 border border-border rounded-md shadow-sm h-[320px]">
                <SystemHealthPieChart />
              </div>
              <div className="lg:col-span-2 border border-border rounded-md shadow-sm h-[320px]">
                <InfrastructureMap />
              </div>
            </div>

            {/* RealTime Metrics */}
            <div className="border border-border rounded-md p-4 bg-sidebar/50 shadow-sm">
              <RealTimeCharts />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Server Fleet Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {servers.slice(0, 4).map(server => (
                       <ServerCard 
                          key={server.id} 
                          server={server} 
                          selected={selectedServer?.id === server.id}
                          onClick={() => setSelectedServer(server)}
                       />
                    ))}
                  </div>
               </div>
               <div className="lg:col-span-1">
                  <UptimeWidget />
               </div>
            </div>
          </div>
        </div>

        {/* Right Side Alerts Panel */}
        <div className="h-full shrink-0">
          <AlertsPanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
