import { uptimeWidgetData } from "@/lib/mockFeatures";

const UptimeWidget = () => {
  return (
    <div className="bg-card border border-border p-4 rounded-md">
       <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">System Availability</h3>
       <div className="flex items-center gap-4">
         <div className="flex-1 relative flex items-center justify-center">
            {/* Circular Progress (CSS based for simplicity) */}
            <svg viewBox="0 0 36 36" className="w-24 h-24 stroke-current text-secondary stroke-[3]">
              <path
                className="fill-none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="fill-none text-status-healthy"
                strokeDasharray={`${uptimeWidgetData.uptimePercentage}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="text-[10px] font-mono font-medium fill-foreground" textAnchor="middle">
                {uptimeWidgetData.uptimePercentage}%
              </text>
            </svg>
         </div>
         <div className="flex-1 space-y-4 font-mono text-xs">
            <div>
              <div className="text-muted-foreground uppercase text-[10px] mb-1">Target SLA</div>
              <div className="text-foreground">99.90%</div>
            </div>
            <div>
              <div className="text-muted-foreground uppercase text-[10px] mb-1">Last Downtime</div>
              <div className="text-foreground">{uptimeWidgetData.lastDowntime}</div>
            </div>
            <div>
              <div className="text-muted-foreground uppercase text-[10px] mb-1">Incidents (30d)</div>
              <div className="text-foreground">{uptimeWidgetData.totalIncidents}</div>
            </div>
         </div>
       </div>
    </div>
  );
};

export default UptimeWidget;
