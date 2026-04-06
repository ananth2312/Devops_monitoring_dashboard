import { Server, generateTimeSeries, events as allEvents, alerts as allAlerts } from "@/lib/mockData";
import PerformanceChart from "./PerformanceChart";
import ResourceBar from "./ResourceBar";
import EventsTable from "./EventsTable";
import AlertsSeverity from "./AlertsSeverity";

interface ServerDetailProps {
  server: Server;
}

const statusLabel: Record<string, string> = {
  healthy: "HEALTHY",
  warning: "WARNING",
  critical: "CRITICAL",
  offline: "OFFLINE",
};

const statusColor: Record<string, string> = {
  healthy: "text-status-healthy",
  warning: "text-status-warning",
  critical: "text-status-critical",
  offline: "text-muted-foreground",
};

const ServerDetail = ({ server }: ServerDetailProps) => {
  const timeSeries = generateTimeSeries(24);
  const serverEvents = allEvents.filter((e) => e.server === server.name).slice(0, 5);
  const serverAlerts = allAlerts.filter((a) => a.server === server.name);

  return (
    <div className="h-full overflow-y-auto">
      {/* Server header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground font-mono">{server.name}</h2>
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground font-mono">
              <span>{server.ip}</span>
              <span>{server.location}</span>
              <span>uptime: {server.uptime}</span>
            </div>
          </div>
          <span className={`text-xs font-semibold font-mono ${statusColor[server.status]}`}>
            [{statusLabel[server.status]}]
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Resource utilization bars */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Resource Utilization
          </h3>
          <div className="space-y-3">
            <ResourceBar label="CPU" value={server.cpu} />
            <ResourceBar label="Memory" value={server.memory} />
            <ResourceBar label="Disk" value={server.disk} />
          </div>
        </div>

        {/* Performance graph */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Performance — 24h
          </h3>
          <PerformanceChart data={timeSeries} />
        </div>

        {/* Alerts for this server */}
        {serverAlerts.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Active Alerts
            </h3>
            <AlertsSeverity alerts={serverAlerts} />
          </div>
        )}

        {/* Recent events */}
        {serverEvents.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Recent Events
            </h3>
            <EventsTable events={serverEvents} compact />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerDetail;
