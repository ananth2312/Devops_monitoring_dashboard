import DashboardLayout from "@/components/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="px-6 py-3 border-b border-border">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Settings
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Thresholds */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Alert Thresholds
            </h3>
            <div className="space-y-3 max-w-md">
              {[
                { label: "CPU Warning", value: "75%" },
                { label: "CPU Critical", value: "90%" },
                { label: "Memory Warning", value: "80%" },
                { label: "Memory Critical", value: "90%" },
                { label: "Disk Warning", value: "75%" },
                { label: "Disk Critical", value: "90%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">{item.label}</span>
                  <input
                    type="text"
                    defaultValue={item.value}
                    className="bg-secondary border border-border text-foreground px-3 py-1.5 rounded-sm w-20 text-right outline-none focus:border-muted-foreground transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Notifications
            </h3>
            <div className="space-y-2 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 border border-border rounded-sm bg-status-healthy/20" />
                <span>Email alerts enabled</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 border border-border rounded-sm" />
                <span>Slack integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 border border-border rounded-sm" />
                <span>PagerDuty integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
