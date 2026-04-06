export const uptimeWidgetData = {
  uptimePercentage: "99.98",
  totalIncidents: 3,
  lastDowntime: "14 days ago"
};

export const incidents = [
  { id: "inc-1", time: "10:02 AM", title: "CPU Spike Detected", description: "Node prod-node-4 CPU utilization hit 95%", status: "resolved", severity: "high" },
  { id: "inc-2", time: "10:04 AM", title: "Memory Allocation Warning", description: "OOM killer invoked on prod-node-4", status: "resolved", severity: "critical" },
  { id: "inc-3", time: "10:05 AM", title: "Server Crash", description: "prod-node-4 unreachable via ping", status: "resolved", severity: "critical" },
  { id: "inc-4", time: "10:10 AM", title: "Server Recovered", description: "prod-node-4 rebooted and healthy", status: "resolved", severity: "info" },
];
