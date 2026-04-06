import { SystemEvent } from "@/lib/mockData";

interface EventsTableProps {
  events: SystemEvent[];
  compact?: boolean;
}

const statusStyle: Record<string, string> = {
  OK: "text-status-healthy",
  WARNING: "text-status-warning",
  CRITICAL: "text-status-critical",
  INFO: "text-status-info",
};

const EventsTable = ({ events, compact }: EventsTableProps) => {
  return (
    <div className="bg-card rounded-sm border border-border overflow-hidden">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left px-4 py-2 font-medium">Time</th>
            <th className="text-left px-2 py-2 font-medium">Status</th>
            <th className="text-left px-2 py-2 font-medium">Event</th>
            {!compact && <th className="text-left px-4 py-2 font-medium">Server</th>}
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-border last:border-0">
              <td className="px-4 py-2 text-muted-foreground">{event.time}</td>
              <td className={`px-2 py-2 font-semibold ${statusStyle[event.status]}`}>
                {event.status}
              </td>
              <td className="px-2 py-2 text-foreground">{event.event}</td>
              {!compact && <td className="px-4 py-2 text-muted-foreground">{event.server}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
