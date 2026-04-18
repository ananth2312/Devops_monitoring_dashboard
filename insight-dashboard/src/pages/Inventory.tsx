import { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ServerDetail from "@/components/widgets/ServerDetail";
import { Server } from "@/lib/mockData";
import { Search, Filter, Plus, Edit, Trash2, Cloud } from "lucide-react";
import { useServers } from "@/hooks/useServers";
import { ServerModal } from "@/components/widgets/ServerModal";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

const statusStyle: Record<string, string> = {
  healthy: "text-status-healthy",
  warning: "text-status-warning",
  critical: "text-status-critical",
  offline: "text-muted-foreground",
};

const Inventory = () => {
  const { servers, deleteServer, syncAWS, isSyncingAWS } = useServers();
  const { user } = useAuth();
  
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [envFilter, setEnvFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serverToEdit, setServerToEdit] = useState<Server | null>(null);

  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
        setSelectedServer(servers[0]);
    }
  }, [servers, selectedServer]);

  const filteredServers = useMemo(() => {
    return servers.filter((server) => {
      const matchesSearch =
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.ip.includes(searchQuery) ||
        (server.os && server.os.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesEnv = envFilter === "all" || server.environment === envFilter;
      const matchesStatus = statusFilter === "all" || server.status === statusFilter;

      return matchesSearch && matchesEnv && matchesStatus;
    });
  }, [servers, searchQuery, envFilter, statusFilter]);

  const uniqueEnvs = Array.from(new Set(servers.map((s) => s.environment).filter(Boolean)));

  const handleEdit = (s: Server, e: React.MouseEvent) => {
    e.stopPropagation();
    setServerToEdit(s);
    setIsModalOpen(true);
  };

  const handleDelete = async (s: Server, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this server?")) {
      await deleteServer(s.id);
      if (selectedServer?.id === s.id) {
          setSelectedServer(null);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full bg-background overflow-hidden relative">
        <ServerModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          serverToEdit={serverToEdit} 
        />
        {/* Header / Filter Area */}
        <div className="px-6 py-4 border-b border-border bg-sidebar shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold tracking-wider text-foreground">Infrastructure Inventory</h1>
            <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground font-mono">Total Assets: {filteredServers.length}</div>
                {user && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={async () => {
                        try {
                          await syncAWS();
                          alert("Successfully synced with AWS");
                        } catch (err: any) {
                          alert(`Sync failed: ${err.message}`);
                        }
                      }}
                      disabled={isSyncingAWS}
                    >
                      <Cloud className="w-4 h-4 mr-2" />
                      {isSyncingAWS ? "Syncing..." : "Sync AWS"}
                    </Button>
                    <Button size="sm" onClick={() => { setServerToEdit(null); setIsModalOpen(true); }}>
                      <Plus className="w-4 h-4 mr-2" /> Add Server
                    </Button>
                  </>
                )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
            {/* Search */}
            <div className="flex bg-accent/50 items-center px-3 py-2 rounded-md border border-border flex-1 w-full relative">
              <Search className="w-4 h-4 text-muted-foreground mr-2 absolute" />
              <input
                type="text"
                placeholder="Search by server name, IP or OS..."
                className="bg-transparent border-none text-sm text-foreground outline-none w-full pl-6 focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={envFilter}
                  onChange={(e) => setEnvFilter(e.target.value)}
                  className="bg-accent/50 border border-border text-sm rounded-md px-3 py-2 outline-none text-foreground font-mono focus:ring-0"
                >
                  <option value="all">All Environments</option>
                  {uniqueEnvs.map((env) => (
                    <option key={env} value={env}>{env?.toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-accent/50 border border-border text-sm rounded-md px-3 py-2 outline-none text-foreground font-mono focus:ring-0"
                >
                  <option value="all">All Statuses</option>
                  <option value="healthy">Healthy</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Inventory List */}
          <div className="w-[60%] min-w-[500px] border-r border-border overflow-y-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead className="sticky top-0 bg-sidebar/95 backdrop-blur z-10">
                <tr className="border-b border-border text-muted-foreground uppercase">
                  <th className="px-4 py-3 font-medium">Server</th>
                  <th className="px-4 py-3 font-medium">IP Address</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">OS</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Env</th>
                  <th className="px-4 py-3 font-medium">Hardware</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  {user && <th className="px-4 py-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredServers.length === 0 ? (
                  <tr>
                    <td colSpan={user ? 7 : 6} className="px-4 py-12 text-center text-muted-foreground italic">
                      No matching resources found
                    </td>
                  </tr>
                ) : (
                  filteredServers.map((server) => (
                    <tr
                      key={server.id}
                      onClick={() => setSelectedServer(server)}
                      className={`border-b border-border transition-colors cursor-pointer hover:bg-accent/60 ${
                        selectedServer?.id === server.id ? "bg-accent/80 border-l-4 border-l-primary" : "border-l-4 border-l-transparent"
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-foreground">{server.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{server.ip}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{server.os || 'Unknown'}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell capitalize">{server.environment || 'None'}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {server.cpu}% CPU / {server.memory}% RAM
                      </td>
                      <td className={`px-4 py-3 font-semibold uppercase ${statusStyle[server.status]}`}>
                        {server.status}
                      </td>
                      {user && (
                          <td className="px-4 py-3 text-right space-x-2">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleEdit(server, e)}>
                                  <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={(e) => handleDelete(server, e)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                          </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Details Sidebar */}
          <div className="flex-1 overflow-hidden bg-background">
            {selectedServer ? (
              <ServerDetail server={selectedServer} />
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-muted-foreground font-mono">
                // NO RESOURCE SELECTED
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
