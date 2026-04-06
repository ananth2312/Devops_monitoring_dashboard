import DashboardLayout from "@/components/DashboardLayout";
import DeploymentTimeline from "@/components/widgets/DeploymentTimeline";
import { fetchDeployments } from "@/lib/api";
import { useEffect, useState } from "react";

const statusStyle: Record<string, string> = {
  success: "text-status-healthy",
  failed: "text-status-critical",
  in_progress: "text-status-info",
};

const Deployments = () => {
  const [deployments, setDeployments] = useState<Record<string, any>[]>([]);

  useEffect(() => {
     fetchDeployments().then(setDeployments);
  }, []);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="px-6 py-3 border-b border-border">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Deployments
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-6 py-2 font-medium">ID</th>
                <th className="text-left px-2 py-2 font-medium">Version</th>
                <th className="text-left px-2 py-2 font-medium">Environment</th>
                <th className="text-left px-2 py-2 font-medium">Status</th>
                <th className="text-left px-6 py-2 font-medium">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((dep) => (
                <tr key={dep.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-2 text-muted-foreground">{dep.id}</td>
                  <td className="px-2 py-2 text-foreground">{dep.version}</td>
                  <td className="px-2 py-2 text-muted-foreground">{dep.environment}</td>
                  <td className={`px-2 py-2 font-semibold uppercase ${statusStyle[dep.status]}`}>
                    {dep.status.replace("_", " ")}
                  </td>
                  <td className="px-6 py-2 text-muted-foreground">{dep.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="max-w-4xl mx-auto p-6">
            <DeploymentTimeline />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Deployments;
