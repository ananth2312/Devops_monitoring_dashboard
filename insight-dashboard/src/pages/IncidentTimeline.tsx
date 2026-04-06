import DashboardLayout from "@/components/DashboardLayout";
import { incidents } from "@/lib/mockFeatures";
import { Activity, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

const severityColors = {
  info: "text-status-info border-status-info bg-status-info/10",
  warning: "text-status-warning border-status-warning bg-status-warning/10",
  high: "text-orange-500 border-orange-500 bg-orange-500/10",
  critical: "text-status-critical border-status-critical bg-status-critical/10",
};

const getIcon = (severity: string) => {
  if (severity === 'critical') return <ShieldAlert className="w-4 h-4 text-status-critical" />;
  if (severity === 'high') return <Activity className="w-4 h-4 text-orange-500" />;
  if (severity === 'warning') return <AlertTriangle className="w-4 h-4 text-status-warning" />;
  return <CheckCircle2 className="w-4 h-4 text-status-healthy" />;
};

const IncidentTimeline = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-sidebar/50">
          <h1 className="text-lg font-semibold tracking-wider text-foreground">Incident Timeline</h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            Tracking severe infra warnings and their remediation stages.
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-3xl mx-auto">
             <div className="relative pl-8 pt-4 space-y-8 border-l-2 border-border ml-4 pb-12">
               {incidents.map((incident) => {
                  return (
                     <div key={incident.id} className="relative bg-card p-5 border border-border rounded-md shadow-sm">
                        <span className="absolute -left-[45px] top-4 bg-background rounded-full flex items-center justify-center p-1.5 border-2 border-border z-10">
                           {getIcon(incident.severity)}
                        </span>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 border-b border-border/50 pb-3">
                           <h3 className="text-sm font-semibold text-foreground tracking-wide">
                             {incident.title}
                           </h3>
                           <div className="flex items-center gap-3 mt-2 md:mt-0">
                              <span className="text-[10px] font-mono font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-sm">
                                {incident.time}
                              </span>
                              <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-sm border ${severityColors[incident.severity as keyof typeof severityColors]}`}>
                                {incident.severity}
                              </span>
                           </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground font-sans">
                           {incident.description}
                        </p>
                        
                        <div className="mt-4 pt-3 border-t border-border/30 flex justify-between items-center relative z-20">
                           <span className="text-[10px] uppercase font-bold text-status-info tracking-wider border border-status-info/30 bg-status-info/10 px-2 py-1 rounded-sm">
                             Status: {incident.status}
                           </span>
                           <button className="text-xs text-primary hover:text-primary/80 transition-colors uppercase font-semibold font-mono tracking-wider">
                              View Post-Mortem →
                           </button>
                        </div>
                     </div>
                  );
               })}
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IncidentTimeline;
