import { alerts, deployments } from "@/lib/mockData";
import { Server, Activity, ArrowUpRight, ShieldAlert, Rocket } from "lucide-react";
import { useServers } from "@/hooks/useServers";

const TopMetricsOverview = () => {
   const { servers } = useServers();
   const totalServers = servers.length;
   const activeServers = servers.filter(s => s.status === 'healthy' || s.status === 'warning').length;
   const downServers = servers.filter(s => s.status === 'critical' || s.status === 'offline').length;
   
   const activeAlerts = alerts.filter(a => !a.resolved).length;
   const recentDeployments = deployments.filter(d => d.status === 'success').length;

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
         <div className="bg-card border border-border p-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Assets</span>
                  <div className="text-3xl font-mono text-foreground">{totalServers}</div>
               </div>
               <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Server className="w-5 h-5 text-primary" />
               </div>
            </div>
            <div className="flex gap-4 mt-4 text-xs font-mono border-t border-border pt-3">
               <div className="text-status-healthy font-semibold">Active: {activeServers}</div>
               <div className={downServers > 0 ? "text-status-critical font-semibold animate-pulse" : "text-muted-foreground"}>
                  Down: {downServers}
               </div>
            </div>
         </div>

         <div className="bg-card border border-border p-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">System Health</span>
                  <div className="text-3xl font-mono text-status-healthy">98.2%</div>
               </div>
               <div className="h-10 w-10 bg-status-healthy/10 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-status-healthy" />
               </div>
            </div>
            <div className="mt-4 text-xs font-mono border-t border-border pt-3 text-muted-foreground flex gap-1 items-center">
               <ArrowUpRight className="w-3 h-3 text-status-healthy" /> 
               <span className="text-status-healthy">0.4%</span> vs last month
            </div>
         </div>

         <div className="bg-card border border-border p-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Active Alerts</span>
                  <div className="text-3xl font-mono text-status-warning">{activeAlerts}</div>
               </div>
               <div className="h-10 w-10 bg-status-warning/10 rounded-full flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-status-warning" />
               </div>
            </div>
            <div className="mt-4 text-xs font-mono border-t border-border pt-3 text-muted-foreground">
               Requires engineering attention
            </div>
         </div>

         <div className="bg-card border border-border p-4 rounded-md shadow-sm">
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Deployments</span>
                  <div className="text-3xl font-mono text-status-info">{recentDeployments}</div>
               </div>
               <div className="h-10 w-10 bg-status-info/10 rounded-full flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-status-info" />
               </div>
            </div>
            <div className="mt-4 text-xs font-mono border-t border-border pt-3 text-muted-foreground">
               Total successful this week
            </div>
         </div>
      </div>
   );
};

export default TopMetricsOverview;
