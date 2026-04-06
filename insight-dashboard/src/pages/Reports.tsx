import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PerformanceChart from "@/components/widgets/PerformanceChart";
import AlertsSeverity from "@/components/widgets/AlertsSeverity";
import EventsTable from "@/components/widgets/EventsTable";
import { generateTimeSeries, alerts, events, deployments } from "@/lib/mockData";
import { Download, Calendar, FileText } from "lucide-react";

const Reports = () => {
  const [reportType, setReportType] = useState<"performance" | "alerts" | "deployments">("performance");
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  
  // Generating mock data based on selected time range
  const dataPoints = timeRange === "24h" ? 24 : timeRange === "7d" ? 7 : 30;
  const timeSeriesData = generateTimeSeries(dataPoints);

  const handleExport = (format: string) => {
    // Mock export functionality
    const filename = `infrastructure_report_${reportType}_${timeRange}.${format}`;
    console.log(`Exporting ${filename}`);
    alert(`Report exported successfully as ${format.toUpperCase()} (${filename})`);
  };

  const totalDeployments = deployments.length;
  const successDeployments = deployments.filter(d => d.status === "success").length;
  const failedDeployments = deployments.filter(d => d.status === "failed").length;

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background overflow-hidden relative">
        {/* Header Region */}
        <div className="px-6 py-4 border-b border-border bg-sidebar shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold tracking-wider text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Operational Reports
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Analytics and historical performance insights
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-accent/50 border border-border rounded-md px-3 py-1.5 focus-within:ring-1 focus-within:ring-primary/50">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <select 
                  className="bg-transparent text-sm text-foreground outline-none font-mono cursor-pointer"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as "24h" | "7d" | "30d")}
                >
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>

              <div className="group relative">
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-md font-medium transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-sidebar border border-border rounded-md shadow-lg overflow-hidden z-50">
                  <button onClick={() => handleExport("pdf")} className="px-4 py-2 text-left text-xs text-foreground hover:bg-accent hover:text-primary transition-colors cursor-pointer w-full text-nowrap">Export as PDF</button>
                  <button onClick={() => handleExport("csv")} className="px-4 py-2 text-left text-xs text-foreground hover:bg-accent hover:text-primary transition-colors cursor-pointer w-full text-nowrap">Export as CSV</button>
                  <button onClick={() => handleExport("xlsx")} className="px-4 py-2 text-left text-xs text-foreground hover:bg-accent hover:text-primary transition-colors cursor-pointer w-full text-nowrap">Export as Excel</button>
                  <button onClick={() => handleExport("json")} className="px-4 py-2 text-left text-xs text-foreground hover:bg-accent hover:text-primary transition-colors cursor-pointer w-full text-nowrap">Export as JSON</button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Type Tabs */}
          <div className="flex gap-1 mt-6 border-b border-border">
            {[
              { id: "performance", label: "Performance & Utilization" },
              { id: "alerts", label: "Alerts & Incidents" },
              { id: "deployments", label: "Deployment Analytics" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setReportType(tab.id as "performance" | "alerts" | "deployments")}
                className={`px-4 py-2 text-sm font-mono tracking-wide border-b-2 transition-all cursor-pointer ${
                  reportType === tab.id
                    ? "border-primary text-foreground bg-accent/30"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-background">
          
          {reportType === "performance" && (
            <div className="space-y-6 fade-in h-auto min-h-full">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Infrastructure Performance ({timeRange})
                </h2>
                <div className="h-64 mb-4">
                  <PerformanceChart data={timeSeriesData} />
                </div>
                <p className="text-xs text-muted-foreground font-mono">
                  * Chart demonstrates historical CPU and Memory averages across target group.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border p-4 rounded-md">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 mt-0">Avg CPU Usage</h3>
                  <div className="text-3xl font-mono text-status-healthy font-light">45.2%</div>
                  <div className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1">
                    <span className="text-status-healthy">↓ 2.1%</span> vs previous period
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-md">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 mt-0">Network Trafffic</h3>
                  <div className="text-3xl font-mono text-status-warning font-light">2.4 TB</div>
                  <div className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1">
                    <span className="text-status-critical">↑ 14.5%</span> vs previous period
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-md">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 mt-0">Avg Memory</h3>
                  <div className="text-3xl font-mono text-foreground font-light">62.8%</div>
                  <div className="text-xs text-muted-foreground mt-2 inline-flex items-center gap-1">
                    <span className="text-status-healthy">↓ 0.4%</span> vs previous period
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === "alerts" && (
            <div className="space-y-6 fade-in h-auto min-h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 border border-border bg-card p-4 rounded-md h-fit">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Alert Distribution
                  </h2>
                  <AlertsSeverity alerts={alerts} />
                </div>
                <div className="lg:col-span-2">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Recent Incidents log
                  </h2>
                  <div className="border border-border rounded-md bg-card">
                    <EventsTable events={events} compact={false} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {reportType === "deployments" && (
            <div className="space-y-6 fade-in h-auto min-h-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-card border border-border p-4 rounded-md">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 mt-0">Total Deployments</h3>
                  <div className="text-3xl font-mono text-foreground font-light">{totalDeployments}</div>
                </div>
                <div className="bg-card border border-border p-4 rounded-md">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 mt-0">Success Rate</h3>
                  <div className="text-3xl font-mono text-status-healthy font-light">
                    {totalDeployments > 0 ? Math.round((successDeployments / totalDeployments) * 100) : 0}%
                  </div>
                </div>
                <div className="bg-card border border-border p-4 rounded-md">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 mt-0">Failed Deployments</h3>
                  <div className="text-3xl font-mono text-status-critical font-light">{failedDeployments}</div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Deployment History
                </h2>
                <div className="border border-border rounded-md bg-card overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead className="bg-accent/20 border-b border-border">
                      <tr className="text-muted-foreground">
                        <th className="text-left px-4 py-3 font-medium">Release ID</th>
                        <th className="text-left px-4 py-3 font-medium">Environment</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                        <th className="text-left px-4 py-3 font-medium">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deployments.map((dep) => (
                        <tr key={dep.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="px-4 py-3 font-semibold text-foreground">{dep.version}</td>
                          <td className="px-4 py-3 text-muted-foreground capitalize">{dep.environment}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-semibold border ${
                              dep.status === "success" ? "text-status-healthy border-status-healthy/30 bg-status-healthy/10" :
                              dep.status === "failed" ? "text-status-critical border-status-critical/30 bg-status-critical/10" :
                              "text-status-info border-status-info/30 bg-status-info/10"
                            }`}>
                              {dep.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{dep.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
