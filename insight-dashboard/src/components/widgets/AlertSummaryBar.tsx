import { alertSummary } from "@/lib/mockData";

const items = [
  { key: "disaster" as const, label: "Disaster", color: "bg-status-critical text-status-critical" },
  { key: "high" as const, label: "High", color: "bg-status-critical/70 text-status-critical" },
  { key: "average" as const, label: "Average", color: "bg-status-warning text-status-warning" },
  { key: "warning" as const, label: "Warning", color: "bg-status-warning/70 text-status-warning" },
  { key: "info" as const, label: "Info", color: "bg-status-info text-status-info" },
];

const AlertSummaryBar = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-border text-xs font-mono">
      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Problems:</span>
      {items.map((item) => (
        <div key={item.key} className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${item.color.split(" ")[0]}`} />
          <span className={item.color.split(" ")[1]}>
            {alertSummary[item.key]}
          </span>
          <span className="text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default AlertSummaryBar;
