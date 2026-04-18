import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Server } from "@/lib/mockData";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/servers`;

// Helper to map backend format to frontend format
const mapToFrontend = (server: Record<string, any>): Server => ({
  id: server._id,
  name: server.serverName || server.name || "Unknown Server",
  ip: server.ipAddress || server.ip || "0.0.0.0",
  status: server.status || "healthy",
  cpu: server.cpuUsage ?? server.cpu ?? 0,
  memory: server.memoryUsage ?? server.memory ?? 0,
  disk: server.diskUsage ?? server.disk ?? 0,
  requests: server.requests ?? 0,
  uptime: server.uptime || "0d 0h",
  location: server.location || "us-east-1",
  os: server.environment === 'production' ? 'Ubuntu 22.04' : 'Unknown', // mock mapping if os missing
  environment: server.environment || "production",
});

// Helper to map frontend format to backend format
const mapToBackend = (server: Partial<Server>) => ({
  serverName: server.name,
  ipAddress: server.ip,
  status: server.status,
  cpuUsage: server.cpu,
  memoryUsage: server.memory,
  diskUsage: server.disk,
  requests: server.requests,
  uptime: server.uptime,
  location: server.location,
  environment: server.environment,
  amiId: (server as any).amiId,
  instanceType: (server as any).instanceType,
  subnetId: (server as any).subnetId,
});

export const useServers = () => {
  const queryClient = useQueryClient();

  const { data: servers = [], isLoading, error } = useQuery<Server[]>({
    queryKey: ["servers"],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch servers");
      const data = await response.json();
      return data.map(mapToFrontend);
    },
    refetchInterval: 30000, // Auto-refresh every 30s to pick up AWS sync
  });

  const { mutateAsync: addServer } = useMutation({
    mutationFn: async (newServer: Partial<Server>) => {
      const backendData = mapToBackend(newServer);
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to add server");
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servers"] }),
  });

  const { mutateAsync: updateServer } = useMutation({
    mutationFn: async (updatedServer: Partial<Server> & { id: string }) => {
      const backendData = mapToBackend(updatedServer);
      
      const response = await fetch(`${API_URL}/${updatedServer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to update server");
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servers"] }),
  });

  const { mutateAsync: deleteServer } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to delete server");
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servers"] }),
  });

  const { mutateAsync: syncAWS, isPending: isSyncingAWS } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/aws/sync/servers`, {
        method: "GET",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to sync with AWS");
      }
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servers"] }),
  });

  return {
    servers,
    isLoading,
    error,
    addServer,
    updateServer,
    deleteServer,
    syncAWS,
    isSyncingAWS,
  };
};
