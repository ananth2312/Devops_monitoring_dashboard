import { Server } from "@/lib/mockData";
import { Server as ServerIcon, Cpu, HardDrive, MemoryStick } from "lucide-react";

interface ServerCardProps {
  server: Server;
  onClick?: () => void;
  selected?: boolean;
}

const statusStyle: Record<string, string> = {
  healthy: "text-status-healthy bg-status-healthy/10",
  warning: "text-status-warning bg-status-warning/10",
  critical: "text-status-critical bg-status-critical/10",
  offline: "text-muted-foreground bg-muted/10",
};

const barColor: Record<string, string> = {
  healthy: "bg-status-healthy",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
  offline: "bg-muted-foreground",
};

const ServerCard = ({ server, onClick, selected }: ServerCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`border p-4 rounded-md bg-card transition-all cursor-pointer ${
        selected ? "border-primary shadow-sm shadow-primary/20" : "border-border hover:border-primary/50"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <ServerIcon className="w-4 h-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold text-foreground">{server.name}</h4>
        </div>
        <div className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-wider ${statusStyle[server.status]}`}>
          {server.status}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Cpu className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-muted-foreground">CPU</span>
              <span className="text-foreground">{server.cpu}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${server.cpu > 90 ? barColor.critical : server.cpu > 75 ? barColor.warning : barColor.healthy}`} 
                style={{ width: `${server.cpu}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <MemoryStick className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-muted-foreground">RAM</span>
              <span className="text-foreground">{server.memory}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full ${server.memory > 90 ? barColor.critical : server.memory > 75 ? barColor.warning : barColor.healthy}`} 
                style={{ width: `${server.memory}%` }} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground mt-4 font-mono">
          <span className="uppercase text-[10px] tracking-wider">Uptime</span>
          <span>{server.uptime}</span>
        </div>
      </div>
    </div>
  );
};

export default ServerCard;
