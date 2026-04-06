// Mock data for the DevOps monitoring dashboard

export interface Server {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical" | "offline";
  cpu: number;
  memory: number;
  disk: number;
  requests: number;
  uptime: string;
  ip: string;
  location: string;
  os?: string;
  environment?: string;
}

export interface Alert {
  id: string;
  severity: "disaster" | "high" | "average" | "warning" | "info";
  message: string;
  server: string;
  timestamp: string;
  resolved: boolean;
}

export interface SystemEvent {
  id: string;
  time: string;
  status: "OK" | "WARNING" | "CRITICAL" | "INFO";
  event: string;
  server: string;
}

export interface Deployment {
  id: string;
  version: string;
  environment: string;
  status: "success" | "failed" | "in_progress";
  timestamp: string;
}

export interface TimeSeriesPoint {
  time: string;
  cpu: number;
  memory: number;
  network: number;
  requests: number;
}

export const servers: Server[] = [
  { id: "srv-001", name: "prod-node-1", status: "healthy", cpu: 42, memory: 68, disk: 54, requests: 119, uptime: "45d 12h", ip: "10.0.1.12", location: "us-east-1", os: "Ubuntu 22.04", environment: "production" },
  { id: "srv-002", name: "prod-node-2", status: "warning", cpu: 78, memory: 82, disk: 71, requests: 51, uptime: "23d 8h", ip: "10.0.1.13", location: "us-east-1", os: "Ubuntu 22.04", environment: "production" },
  { id: "srv-003", name: "prod-node-3", status: "healthy", cpu: 35, memory: 55, disk: 42, requests: 147, uptime: "60d 4h", ip: "10.0.2.10", location: "eu-west-1", os: "Debian 12", environment: "production" },
  { id: "srv-004", name: "prod-node-4", status: "critical", cpu: 95, memory: 91, disk: 88, requests: 23, uptime: "2d 1h", ip: "10.0.2.11", location: "eu-west-1", os: "Debian 12", environment: "production" },
  { id: "srv-005", name: "staging-1", status: "healthy", cpu: 12, memory: 34, disk: 28, requests: 8, uptime: "90d 0h", ip: "10.0.3.5", location: "us-west-2", os: "Ubuntu 20.04", environment: "staging" },
  { id: "srv-006", name: "staging-2", status: "healthy", cpu: 18, memory: 41, disk: 33, requests: 12, uptime: "90d 0h", ip: "10.0.3.6", location: "us-west-2", os: "Ubuntu 20.04", environment: "staging" },
  { id: "srv-007", name: "db-primary", status: "healthy", cpu: 55, memory: 72, disk: 67, requests: 340, uptime: "120d 6h", ip: "10.0.4.2", location: "us-east-1", os: "RHEL 9", environment: "production" },
  { id: "srv-008", name: "db-replica-1", status: "warning", cpu: 62, memory: 76, disk: 69, requests: 280, uptime: "120d 6h", ip: "10.0.4.3", location: "us-east-1", os: "RHEL 9", environment: "production" },
  { id: "srv-009", name: "cache-node-1", status: "healthy", cpu: 28, memory: 89, disk: 15, requests: 1200, uptime: "30d 2h", ip: "10.0.5.1", location: "us-east-1", os: "Alpine Linux", environment: "production" },
  { id: "srv-010", name: "lb-primary", status: "healthy", cpu: 22, memory: 35, disk: 12, requests: 2400, uptime: "180d 0h", ip: "10.0.0.2", location: "us-east-1", os: "Ubuntu 22.04", environment: "production" },
];

export const alerts: Alert[] = [
  { id: "alt-001", severity: "disaster", message: "Server prod-node-4 CPU at 95%", server: "prod-node-4", timestamp: "2026-03-10 10:46:12", resolved: false },
  { id: "alt-002", severity: "high", message: "Memory usage exceeded 90% on prod-node-4", server: "prod-node-4", timestamp: "2026-03-10 10:44:30", resolved: false },
  { id: "alt-003", severity: "high", message: "Disk usage at 88% on prod-node-4", server: "prod-node-4", timestamp: "2026-03-10 10:40:15", resolved: false },
  { id: "alt-004", severity: "average", message: "High memory utilization on prod-node-2", server: "prod-node-2", timestamp: "2026-03-10 09:32:00", resolved: false },
  { id: "alt-005", severity: "average", message: "Elevated CPU on db-replica-1", server: "db-replica-1", timestamp: "2026-03-10 09:15:22", resolved: false },
  { id: "alt-006", severity: "warning", message: "Disk usage trending upward on db-primary", server: "db-primary", timestamp: "2026-03-10 08:20:00", resolved: false },
  { id: "alt-007", severity: "info", message: "Scheduled maintenance window approaching", server: "staging-1", timestamp: "2026-03-10 07:00:00", resolved: false },
  { id: "alt-008", severity: "high", message: "Connection pool exhaustion warning", server: "db-primary", timestamp: "2026-03-10 10:30:00", resolved: false },
  { id: "alt-009", severity: "average", message: "Cache hit ratio below threshold", server: "cache-node-1", timestamp: "2026-03-10 10:12:00", resolved: false },
  { id: "alt-010", severity: "high", message: "SSL certificate expiring in 7 days", server: "lb-primary", timestamp: "2026-03-10 06:00:00", resolved: false },
];

export const events: SystemEvent[] = [
  { id: "evt-001", time: "10:46", status: "CRITICAL", event: "CPU threshold exceeded", server: "prod-node-4" },
  { id: "evt-002", time: "10:44", status: "CRITICAL", event: "Memory threshold exceeded", server: "prod-node-4" },
  { id: "evt-003", time: "10:40", status: "WARNING", event: "Disk usage high", server: "prod-node-4" },
  { id: "evt-004", time: "10:32", status: "WARNING", event: "Disk usage trending up", server: "db-primary" },
  { id: "evt-005", time: "10:30", status: "WARNING", event: "Connection pool at 80%", server: "db-primary" },
  { id: "evt-006", time: "10:15", status: "OK", event: "Deployment v2.4.1 complete", server: "prod-node-1" },
  { id: "evt-007", time: "10:12", status: "WARNING", event: "Cache hit ratio 72%", server: "cache-node-1" },
  { id: "evt-008", time: "10:02", status: "OK", event: "Health check passed", server: "prod-node-3" },
  { id: "evt-009", time: "09:55", status: "INFO", event: "Auto-scaling triggered", server: "lb-primary" },
  { id: "evt-010", time: "09:32", status: "WARNING", event: "Memory usage elevated", server: "prod-node-2" },
];

export const deployments: Deployment[] = [
  { id: "dep-001", version: "v2.4.1", environment: "production", status: "success", timestamp: "2026-03-10 10:15:00" },
  { id: "dep-002", version: "v2.4.0", environment: "production", status: "success", timestamp: "2026-03-09 14:30:00" },
  { id: "dep-003", version: "v2.4.2-rc1", environment: "staging", status: "in_progress", timestamp: "2026-03-10 10:45:00" },
  { id: "dep-004", version: "v2.3.9", environment: "production", status: "failed", timestamp: "2026-03-08 09:20:00" },
  { id: "dep-005", version: "v2.3.8", environment: "production", status: "success", timestamp: "2026-03-07 16:00:00" },
];

export function generateTimeSeries(points: number = 24): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    data.push({
      time: `${time.getHours().toString().padStart(2, "0")}:00`,
      cpu: 30 + Math.random() * 40 + (i < 4 ? 20 : 0),
      memory: 55 + Math.random() * 25,
      network: 100 + Math.random() * 300,
      requests: 50 + Math.random() * 150,
    });
  }
  return data;
}

export const alertSummary = {
  disaster: 1,
  high: 4,
  average: 3,
  warning: 1,
  info: 1,
};

export const logEntries = [
  { timestamp: "2026-03-10 10:46:12", level: "ERROR", message: "CPU usage exceeded threshold: 95%", server: "prod-node-4" },
  { timestamp: "2026-03-10 10:44:30", level: "ERROR", message: "Memory allocation failed, OOM killer invoked", server: "prod-node-4" },
  { timestamp: "2026-03-10 10:40:15", level: "WARN", message: "Disk partition /data at 88% capacity", server: "prod-node-4" },
  { timestamp: "2026-03-10 10:32:00", level: "WARN", message: "Slow query detected: SELECT * FROM metrics (2.3s)", server: "db-primary" },
  { timestamp: "2026-03-10 10:30:00", level: "WARN", message: "Connection pool utilization at 80%", server: "db-primary" },
  { timestamp: "2026-03-10 10:15:00", level: "INFO", message: "Deployment v2.4.1 completed successfully", server: "prod-node-1" },
  { timestamp: "2026-03-10 10:12:00", level: "WARN", message: "Cache hit ratio dropped to 72%", server: "cache-node-1" },
  { timestamp: "2026-03-10 10:02:00", level: "INFO", message: "Health check passed all assertions", server: "prod-node-3" },
  { timestamp: "2026-03-10 09:55:00", level: "INFO", message: "Auto-scaling group increased to 3 instances", server: "lb-primary" },
  { timestamp: "2026-03-10 09:32:00", level: "WARN", message: "Memory usage at 82%, approaching threshold", server: "prod-node-2" },
  { timestamp: "2026-03-10 09:15:22", level: "WARN", message: "CPU load average above normal: 3.2", server: "db-replica-1" },
  { timestamp: "2026-03-10 09:00:00", level: "INFO", message: "Log rotation completed", server: "prod-node-1" },
  { timestamp: "2026-03-10 08:45:00", level: "DEBUG", message: "Metrics collection cycle completed in 1.2s", server: "prod-node-3" },
  { timestamp: "2026-03-10 08:20:00", level: "WARN", message: "Disk I/O latency elevated: avg 12ms", server: "db-primary" },
  { timestamp: "2026-03-10 08:00:00", level: "INFO", message: "Daily backup completed successfully", server: "db-primary" },
];
