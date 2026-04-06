import { Server } from "@/lib/mockData";

interface ServerListProps {
  servers: Server[];
  selectedId: string | null;
  onSelect: (server: Server) => void;
}

const statusColor: Record<string, string> = {
  healthy: "bg-status-healthy",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
  offline: "bg-muted-foreground",
};

const ServerList = ({ servers, selectedId, onSelect }: ServerListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground">
          Servers
        </h2>
        <span className="text-xs text-muted-foreground">{servers.length} nodes</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-left px-2 py-2 font-medium">Name</th>
              <th className="text-right px-2 py-2 font-medium">CPU</th>
              <th className="text-right px-2 py-2 font-medium">Mem</th>
              <th className="text-right px-4 py-2 font-medium">Req/s</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((server) => (
              <tr
                key={server.id}
                onClick={() => onSelect(server)}
                className={`border-b border-border cursor-pointer transition-colors ${
                  selectedId === server.id
                    ? "bg-accent"
                    : "hover:bg-accent/50"
                }`}
              >
                <td className="px-4 py-2">
                  <span className={`inline-block w-2 h-2 rounded-full ${statusColor[server.status]}`} />
                </td>
                <td className="px-2 py-2 text-foreground font-mono">{server.name}</td>
                <td className="px-2 py-2 text-right text-muted-foreground">{server.cpu}%</td>
                <td className="px-2 py-2 text-right text-muted-foreground">{server.memory}%</td>
                <td className="px-4 py-2 text-right text-muted-foreground">{server.requests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServerList;
