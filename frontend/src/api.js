// The API address comes from the VITE_API_URL environment variable.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function apiRequest(token, path, method = "GET", body) {
  return fetch(`${API_URL}/api/${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
