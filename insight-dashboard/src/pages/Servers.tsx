import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ServerList from "@/components/widgets/ServerList";
import ServerDetail from "@/components/widgets/ServerDetail";
import { Server } from "@/lib/mockData";
import { useServers } from "@/hooks/useServers";

const Servers = () => {
  const { servers } = useServers();
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
        setSelectedServer(servers[0]);
    }
  }, [servers, selectedServer]);

  return (
    <DashboardLayout>
      <div className="flex h-full overflow-hidden">
        <div className="w-[40%] min-w-[320px] border-r border-border overflow-hidden">
          <ServerList
            servers={servers}
            selectedId={selectedServer?.id ?? null}
            onSelect={setSelectedServer}
          />
        </div>
        <div className="flex-1 overflow-hidden">
          {selectedServer ? (
            <ServerDetail server={selectedServer} />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-mono">
              // NO SERVER SELECTED
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Servers;
