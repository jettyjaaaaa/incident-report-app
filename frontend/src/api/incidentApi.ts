import axios from "axios";
import { type Incident } from "../types/incident";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "X-User-Id": "frontend-user",
  },
});

export const getIncidents = (params?: any) =>
  API.get<Incident[]>("/incidents", { params });

export const createIncident = (data: Partial<Incident>) =>
  API.post("/incidents", data);

export const updateIncident = (id: string, data: Partial<Incident>) =>
  API.patch(`/incidents/${id}`, data);

export const deleteIncident = (id: string) =>
  API.delete(`/incidents/${id}`);

export const getDeleted = () =>
  API.get<Incident[]>("/incidents/deleted");

export const restoreIncident = (id: string) =>
  API.post(`/incidents/${id}/restore`);
