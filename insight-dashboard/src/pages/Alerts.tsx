import DashboardLayout from "@/components/DashboardLayout";
import AlertsSeverity from "@/components/widgets/AlertsSeverity";
import AlertSummaryBar from "@/components/widgets/AlertSummaryBar";
import { alerts } from "@/lib/mockData";

const Alerts = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <AlertSummaryBar />
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            All Active Alerts
          </h2>
          <AlertsSeverity alerts={alerts} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
