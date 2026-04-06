import { deployments } from "@/lib/mockData";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const getIconAndColor = (status: string) => {
   switch (status) {
      case 'success': return { icon: <CheckCircle2 className="w-4 h-4 text-status-healthy" />, color: "bg-status-healthy" };
      case 'failed': return { icon: <XCircle className="w-4 h-4 text-status-critical" />, color: "bg-status-critical" };
      default: return { icon: <Clock className="w-4 h-4 text-status-info animate-pulse" />, color: "bg-status-info" };
   }
};

const DeploymentTimeline = () => {
   return (
      <div className="bg-card border border-border p-5 rounded-md mt-6">
         <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">Deployment History</h3>
         <div className="relative pl-6 space-y-8 border-l-2 border-border ml-2 pb-2">
            {deployments.map((dep, index) => {
               const { icon, color } = getIconAndColor(dep.status);
               return (
                  <div key={dep.id} className="relative">
                     <span className="absolute -left-[35px] top-1 bg-card rounded-full flex items-center justify-center p-0.5 border border-border">
                        {icon}
                     </span>
                     <div className="flex flex-col mb-1 sm:flex-row sm:items-center sm:justify-between">
                        <h4 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
                           Version {dep.version} 
                           <span className="bg-accent text-muted-foreground text-[10px] px-1.5 py-0.5 rounded-sm ml-2">
                              {dep.environment}
                           </span>
                        </h4>
                        <span className="text-xs font-mono text-muted-foreground mt-1 sm:mt-0">
                           {dep.timestamp}
                        </span>
                     </div>
                     <p className="text-xs text-muted-foreground">
                        Status: <span className="uppercase text-[10px] tracking-wider font-semibold" style={{ color: color.replace('bg-', 'var(--') }}>{dep.status.replace('_', ' ')}</span>
                     </p>
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default DeploymentTimeline;
