// Read the API base address from the environment configuration.
const apiUrl = import.meta.env.VITE_API_URL;

if (apiUrl === undefined) {
  throw new Error("VITE_API_URL is not configured.");
}

export const API_URL = apiUrl.replace(/\/+$/, "");

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