import DashboardLayout from "@/components/DashboardLayout";
import LogViewer from "@/components/widgets/LogViewer";

const Logs = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background overflow-hidden p-6 z-10 w-full relative pt-12">
        <h1 className="text-xl font-semibold tracking-wider text-foreground absolute top-4 left-6 z-[100]">System Telemetry Stream</h1>
        <div className="mt-6 flex-1 bg-card rounded-md overflow-hidden relative border border-border">
          <LogViewer />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Logs;
