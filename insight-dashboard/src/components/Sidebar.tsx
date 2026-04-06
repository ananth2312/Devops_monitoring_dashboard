import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Server,
  Rocket,
  ScrollText,
  AlertTriangle,
  Package,
  BarChart3,
  Settings,
  Search,
  ActivitySquare,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { DarkModeToggle } from "./widgets/DarkModeToggle";
import { useAuth } from "./AuthProvider";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Server, label: "Servers", path: "/servers" },
  { icon: Rocket, label: "Deployments", path: "/deployments" },
  { icon: ScrollText, label: "Logs", path: "/logs" },
  { icon: AlertTriangle, label: "Alerts", path: "/alerts" },
  { icon: Package, label: "Inventory", path: "/inventory" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: ActivitySquare, label: "Incidents", path: "/incidents" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();

  return (
    <aside className="w-[240px] min-w-[240px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-sidebar-border flex items-center justify-between">
        <div>
           <div className="text-sm font-semibold tracking-wider text-sidebar-foreground uppercase">
             Monolith
           </div>
           <div className="text-xs text-muted-foreground mt-0.5">
             // infrastructure monitor
           </div>
        </div>
        <DarkModeToggle />
      </div>

      {/* Search */}
      <div className="px-3 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-sidebar-accent rounded-sm">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-sidebar-foreground placeholder:text-muted-foreground outline-none w-full font-mono"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-mono transition-colors ${
                isActive
                  ? "text-sidebar-foreground bg-sidebar-accent"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer status */}
      <div className="px-4 py-3 border-t border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-status-healthy animate-pulse-slow" />
          <span>system operational</span>
        </div>
        <button
          onClick={logout}
          className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all hover:scale-105 active:scale-95"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
