import { useEffect, useState } from "react";
import { fetchAlerts } from "@/lib/api";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

export const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Record<string, any>[]>([]);

  useEffect(() => {
     fetchAlerts().then(setAlerts);
     const int = setInterval(() => fetchAlerts().then(setAlerts), 5000);
     return () => clearInterval(int);
  }, []);

  const activeAlerts = alerts.filter((a) => !a.resolved).slice(0, 5);

  const getIcon = (severity: string) => {
    switch(severity) {
      case 'disaster':
      case 'critical':
      case 'high':
         return <ShieldAlert className="w-4 h-4 text-status-critical" />;
      case 'warning':
      case 'average':
         return <AlertTriangle className="w-4 h-4 text-status-warning" />;
      default:
         return <Info className="w-4 h-4 text-status-info" />;
    }
  };

  const getBorder = (severity: string) => {
    switch(severity) {
      case 'disaster':
      case 'critical':
      case 'high':
         return "border-l-status-critical";
      case 'warning':
      case 'average':
         return "border-l-status-warning";
      default:
         return "border-l-status-info";
    }
  };

  return (
    <div className="bg-sidebar border-l border-border h-full flex flex-col w-[280px]">
      <div className="px-5 py-4 border-b border-border bg-card/50">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
           <AlertTriangle className="w-4 h-4" />
           Active Alerts
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeAlerts.map((alert) => (
           <div key={alert.id} className={`bg-card border border-border border-l-4 p-3 rounded-md shadow-sm ${getBorder(alert.severity)}`}>
             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                   {getIcon(alert.severity)}
                   <span className="text-[10px] font-mono tracking-wider uppercase text-muted-foreground">{alert.severity}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{alert.timestamp.split(" ")[1]}</span>
             </div>
             <p className="text-xs text-foreground font-sans leading-relaxed">{alert.message}</p>
             <div className="mt-2 text-[10px] font-mono text-muted-foreground break-all bg-accent/30 p-1.5 rounded-sm">
               Host: {alert.serverName || alert.server}
             </div>
           </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
         <button className="w-full py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs uppercase tracking-wider font-semibold rounded-md transition-colors">
            View All Alerts
         </button>
      </div>
    </div>
  );
};

export default AlertsPanel;
