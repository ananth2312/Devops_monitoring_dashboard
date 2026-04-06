interface ResourceBarProps {
  label: string;
  value: number;
  total?: string;
}

const getBarColor = (value: number): string => {
  if (value >= 90) return "bg-status-critical";
  if (value >= 75) return "bg-status-warning";
  return "bg-status-healthy";
};

const ResourceBar = ({ label, value, total }: ResourceBarProps) => {
  return (
    <div className="flex items-center gap-3 text-xs font-mono">
      <span className="w-16 text-muted-foreground text-right">{label}</span>
      <div className="flex-1 h-3 bg-secondary rounded-sm overflow-hidden">
        <div
          className={`h-full rounded-sm transition-all duration-500 ${getBarColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-12 text-right text-foreground">{value}%</span>
      {total && <span className="text-muted-foreground">{total}</span>}
    </div>
  );
};

export default ResourceBar;
