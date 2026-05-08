import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" }
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

export const authApi = {
  register: (payload) => api.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => api.post("/auth/login", payload).then((r) => r.data),
  updateProfile: (payload) => api.put("/auth/profile", payload).then((r) => r.data),
  updatePassword: (payload) => api.put("/auth/password", payload).then((r) => r.data)
};

export const propertiesApi = {
  list: () => api.get("/properties").then((r) => r.data),
  search: (query) => api.get(`/properties/search?query=${query}`).then((r) => r.data),
  create: (payload) => api.post("/properties", payload).then((r) => r.data),
  get: (id) => api.get(`/properties/${id}`).then((r) => r.data),
  update: (id, payload) => api.put(`/properties/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/properties/${id}`).then((r) => r.data)
};

export const tenantsApi = {
  list: () => api.get("/tenants").then((r) => r.data),
  join: (payload) => api.post("/tenants/join", payload).then((r) => r.data),
  create: (payload) => api.post("/tenants", payload).then((r) => r.data),
  get: (id) => api.get(`/tenants/${id}`).then((r) => r.data),
  update: (id, payload) => api.put(`/tenants/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/tenants/${id}`).then((r) => r.data)
};

export const paymentsApi = {
  list: () => api.get("/payments").then((r) => r.data),
  create: (payload) => api.post("/payments", payload).then((r) => r.data),
  approve: (id, payload) => api.patch(`/payments/${id}/approve`, payload).then((r) => r.data)
};

export const notificationsApi = {
  list: () => api.get("/notifications").then((r) => r.data),
  markAsRead: () => api.post("/notifications/read").then((r) => r.data)
};

export const documentsApi = {
  list: () => api.get("/documents").then((r) => r.data),
  upload: (formData) => api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }).then((r) => r.data),
  remove: (id) => api.delete(`/documents/${id}`).then((r) => r.data)
};
