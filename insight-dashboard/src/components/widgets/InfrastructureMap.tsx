import { MapContainer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { DivIcon } from "leaflet";
import { useServers } from "@/hooks/useServers";
import { useTheme } from "next-themes";

const coords: Record<string, [number, number]> = {
  "us-east-1": [38.8951, -77.0364],
  "us-east-2": [40.4173, -82.9071],
  "us-west-1": [37.3382, -121.8863],
  "us-west-2": [45.5231, -122.6765],
  "eu-west-1": [53.3498, -6.2603],
  "eu-central-1": [50.1109, 8.6821],
  "ap-south-1": [19.0760, 72.8777],
  "ap-northeast-1": [35.6762, 139.6503],
  "ap-southeast-1": [1.3521, 103.8198],
  "ap-southeast-2": [-33.8688, 151.2093],
  "sa-east-1": [-23.5505, -46.6333],
  "ca-central-1": [45.4215, -75.6972],
};

const statusColors: Record<string, string> = {
  healthy: "hsl(142, 71%, 45%)",
  warning: "hsl(37, 90%, 55%)",
  critical: "hsl(0, 84%, 60%)",
  offline: "hsl(215, 14%, 34%)"
};

const createIcon = (color: string) => {
  return new DivIcon({
    className: "custom-leaflet-icon",
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.5); cursor: pointer;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

// Strip AZ suffix from AWS placement zones to get region
// e.g. "us-east-1a", "us-east-1c" → "us-east-1"
const normalizeToRegion = (location: string): string => {
  // Matches "us-east-1a", "ap-south-1b", "eu-central-1c" etc. and strips trailing letter(s)
  return location.replace(/[a-z]$/, "");
};

const InfrastructureMap = () => {
  const { servers } = useServers();
  const { resolvedTheme } = useTheme();

  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
      .then(res => res.json())
      .then(data => setGeoData(data));
  }, []);

  const isDark = resolvedTheme === "dark";
  const mapBg = isDark ? "#0f172a" : "#b8e1fc";
  const mapFill = isDark ? "#1e293b" : "#ffffff";
  const mapBorder = isDark ? "#020617" : "#000000";

  // Pre-compute stable jittered positions per server id so markers
  // don't jump around on every re-render / refetch
  const jitteredPositions = useMemo(() => {
    const map: Record<string, [number, number]> = {};
    servers.forEach(server => {
      const region = normalizeToRegion(server.location);
      const base = coords[region];
      if (base) {
        // Use a seeded-like offset based on server id so it's stable
        const seed = server.id ? server.id.charCodeAt(server.id.length - 1) / 255 : Math.random();
        map[server.id] = [
          base[0] + (seed - 0.5) * 2,
          base[1] + (seed - 0.5) * 4,
        ];
      }
    });
    return map;
  }, [servers]);

  return (
    <div className="bg-card border border-border p-4 rounded-md flex flex-col h-full z-0 relative">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Infrastructure Geography</h3>
      <div className="flex-1 rounded-sm overflow-hidden z-0" style={{ minHeight: "250px" }}>
        <MapContainer center={[45, -40]} zoom={2} style={{ height: "100%", width: "100%", background: mapBg }}>
          {geoData && (
            <GeoJSON
              key={resolvedTheme}
              data={geoData}
              style={{
                fillColor: mapFill,
                weight: 0.5,
                opacity: 1,
                color: mapBorder,
                fillOpacity: 1
              }}
            />
          )}
          {servers
            .filter(server => {
              const region = normalizeToRegion(server.location);
              return coords[region] !== undefined;
            })
            .map((server) => {
              const position = jitteredPositions[server.id];
              if (!position) return null;

              return (
                <Marker
                  key={server.id}
                  position={position}
                  icon={createIcon(statusColors[server.status] || statusColors.offline)}
                >
                  <Popup className="font-mono text-xs">
                    <div style={{ background: "transparent", color: "#333" }}>
                      <div className="font-bold text-sm mb-1">{server.name}</div>
                      <div>Region: <span className="font-semibold">{normalizeToRegion(server.location)}</span></div>
                      <div>AZ: <span className="text-muted-foreground">{server.location}</span></div>
                      <div>IP: <span className="text-muted-foreground">{server.ip}</span></div>
                      <div className="uppercase font-semibold mt-1" style={{ color: statusColors[server.status] }}>{server.status}</div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </div>
    </div>
  );
};

export default InfrastructureMap;
