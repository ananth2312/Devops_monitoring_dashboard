import { MapContainer, GeoJSON, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { DivIcon } from "leaflet";
import { useServers } from "@/hooks/useServers";
import { useTheme } from "next-themes";

const coords: Record<string, [number, number]> = {
  "us-east-1": [38.8951, -77.0364], // N. Virginia (Washington DC)
  "us-east-2": [40.4173, -82.9071], // Ohio
  "us-west-1": [37.3382, -121.8863], // N. California
  "us-west-2": [45.5231, -122.6765], // Oregon (Portland)
  "eu-west-1": [53.3498, -6.2603],   // Ireland (Dublin)
  "eu-central-1": [50.1109, 8.6821], // Frankfurt
  "ap-south-1": [19.0760, 72.8777],  // Mumbai
  "ap-northeast-1": [35.6762, 139.6503], // Tokyo
  "ap-southeast-1": [1.3521, 103.8198], // Singapore
  "ap-southeast-2": [-33.8688, 151.2093], // Sydney
  "sa-east-1": [-23.5505, -46.6333], // São Paulo
  "ca-central-1": [45.4215, -75.6972], // Central Canada
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

  return (
    <div className="bg-card border border-border p-4 rounded-md flex flex-col h-full z-0 relative">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Infrastructure Geography</h3>
      <div className="flex-1 rounded-sm overflow-hidden z-0" style={{ minHeight: "250px" }}>
        <MapContainer center={[45, -40]} zoom={2} style={{ height: "100%", width: "100%", background: mapBg }}>
          {geoData && (
            <GeoJSON 
              key={resolvedTheme} // Forces redraw on theme change
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
          {servers.filter(server => coords[server.location]).map((server) => {
             const position = coords[server.location];
             
             // slightly jitter the position to prevent overlap
             const jittered: [number, number] = [
               position[0] + (Math.random() - 0.5) * 2,
               position[1] + (Math.random() - 0.5) * 2
             ];

             return (
               <Marker 
                  key={server.id} 
                  position={jittered}
                  icon={createIcon(statusColors[server.status])}
               >
                 <Popup className="font-mono text-xs">
                   <div style={{ background: "transparent", color: "#333" }}>
                     <div className="font-bold text-sm mb-1">{server.name}</div>
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
