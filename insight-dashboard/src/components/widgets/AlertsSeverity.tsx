import { Alert } from "@/lib/mockData";

interface AlertsSeverityProps {
  alerts: Alert[];
}

const severityStyle: Record<string, string> = {
  disaster: "text-status-critical border-status-critical/30 bg-status-critical/5",
  high: "text-status-critical border-status-critical/20 bg-status-critical/5",
  average: "text-status-warning border-status-warning/20 bg-status-warning/5",
  warning: "text-status-warning border-status-warning/15 bg-status-warning/5",
  info: "text-status-info border-status-info/20 bg-status-info/5",
};

const severityLabel: Record<string, string> = {
  disaster: "DISASTER",
  high: "HIGH",
  average: "AVERAGE",
  warning: "WARNING",
  info: "INFO",
};

const AlertsSeverity = ({ alerts }: AlertsSeverityProps) => {
  return (
    <div className="space-y-1">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-center gap-3 px-3 py-2 border rounded-sm text-xs font-mono ${severityStyle[alert.severity]}`}
        >
          <span className="font-semibold w-20 uppercase text-[10px]">
            {severityLabel[alert.severity]}
          </span>
          <span className="flex-1 text-foreground">{alert.message}</span>
          <span className="text-muted-foreground text-[10px]">
            {alert.timestamp.split(" ")[1]}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AlertsSeverity;
