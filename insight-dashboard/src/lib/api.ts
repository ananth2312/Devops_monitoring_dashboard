import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const fetchServers = async () => (await api.get('/servers')).data;
export const fetchMetrics = async () => (await api.get('/metrics')).data;
export const fetchLogs = async () => (await api.get('/logs')).data;
export const fetchDeployments = async () => (await api.get('/deployments')).data;
export const fetchAlerts = async () => (await api.get('/alerts')).data;
