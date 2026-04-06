import { useState, useRef, useEffect } from "react";
import { fetchLogs } from "@/lib/api";
import { Terminal, Copy, Play, Square, Filter } from "lucide-react";

const levelStyle: Record<string, string> = {
  ERROR: "text-status-critical",
  WARN: "text-status-warning",
  INFO: "text-status-info",
  DEBUG: "text-muted-foreground",
};

export const LogViewer = () => {
  const [logEntries, setLogEntries] = useState<Record<string, any>[]>([]);
  const [filter, setFilter] = useState("");
  const [activeLevels, setActiveLevels] = useState<Record<string, boolean>>({
    ERROR: true,
    WARN: true,
    INFO: true,
    DEBUG: true,
  });
  const [isFollowing, setIsFollowing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      fetchLogs().then(setLogEntries);
      const int = setInterval(() => {
         if (isFollowing) fetchLogs().then(setLogEntries);
      }, 3000);
      return () => clearInterval(int);
  }, [isFollowing]);

  const toggleLevel = (level: string) => {
    setActiveLevels(prev => ({ ...prev, [level]: !prev[level] }));
  };

  const filteredLogs = logEntries.filter(
    (entry) =>
      activeLevels[entry.level] &&
      (entry.message.toLowerCase().includes(filter.toLowerCase()) ||
       entry.server.toLowerCase().includes(filter.toLowerCase()))
  );

  useEffect(() => {
    if (isFollowing && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredLogs.length, isFollowing]);

  return (
    <div className="flex flex-col h-full bg-background border border-border rounded-md shadow-sm overflow-hidden font-mono">
      {/* ToolBar */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 py-2 bg-[#121212] border-b border-[#2a2a2a] gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Terminal className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-semibold text-[#e0e0e0] uppercase tracking-wider">Live Log Stream</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
             <Filter className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
             <input
               type="text"
               placeholder="Grep logs..."
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="bg-[#1e1e1e] text-xs text-[#e0e0e0] placeholder:text-[#555] pl-8 pr-3 py-1.5 rounded-sm outline-none border border-[#333] focus:border-primary/50 transition-colors w-40 md:w-64"
             />
          </div>

          <div className="flex bg-[#1e1e1e] rounded-sm border border-[#333] p-0.5">
            {Object.keys(activeLevels).map(level => (
               <button 
                  key={level} 
                  onClick={() => toggleLevel(level)}
                  className={`px-2.5 py-1 text-[10px] tracking-wider uppercase font-semibold transition-colors rounded-sm ${activeLevels[level] ? levelStyle[level] + " bg-accent/20" : "text-[#555] hover:text-[#888]"}`}
               >
                  {level}
               </button>
            ))}
          </div>

          <div className="w-px h-6 bg-[#333] hidden md:block" />

          <button 
             onClick={() => setIsFollowing(!isFollowing)}
             className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-sm transition-colors border ${isFollowing ? 'border-primary/30 text-primary bg-primary/10' : 'border-[#333] text-[#888] bg-[#1e1e1e] hover:text-[#ddd]'}`}
          >
             {isFollowing ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
             {isFollowing ? 'PAUSE' : 'STREAM'}
          </button>
          
          <button className="p-1.5 rounded-sm bg-[#1e1e1e] text-[#888] border border-[#333] hover:text-[#ddd] transition-colors" title="Copy to Clipboard">
             <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Area */}
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-3" ref={scrollRef}>
        {filteredLogs.map((entry, i) => (
          <div
            key={i}
            className="flex flex-wrap group font-mono text-xs py-1 px-2 hover:bg-[#1a1a1a] transition-colors"
          >
            <span className="w-[140px] text-[#555] shrink-0 mr-3">{entry.timestamp}</span>
            <span className={`w-[60px] shrink-0 font-bold ${levelStyle[entry.level]} mr-3`}>
              [{entry.level}]
            </span>
            <span className="w-[120px] text-[#888] shrink-0 mr-3 truncate" title={entry.server}>{entry.server}</span>
            <span className="text-[#cccccc] whitespace-pre-wrap flex-1 min-w-[300px]">{entry.message}</span>
          </div>
        ))}
        {filteredLogs.length === 0 && (
          <div className="flex items-center justify-center h-32 text-[#555] italic">
            $ grep "{filter}" * — 0 results found
          </div>
        )}
      </div>
    </div>
  );
};

export default LogViewer;
