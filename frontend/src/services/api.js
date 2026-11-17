const API = "http://localhost:5000/api";
const authHeaders = () => { const token = localStorage.getItem("clf_token"); return token ? { Authorization: `Bearer ${token}` } : {}; };
async function readResponse(response, fallback) { const result = await response.json(); if (!response.ok) throw new Error(result.message || fallback); return result; }
export async function registerUser(data) { return readResponse(await fetch(`${API}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), "Could not create account"); }
export async function loginUser(data) { return readResponse(await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }), "Could not log in"); }
export async function getCurrentUser() { return readResponse(await fetch(`${API}/auth/me`, { headers: authHeaders() }), "Could not verify session"); }
export async function fetchItems(filters = {}) {
  const params = new URLSearchParams(); Object.entries(filters).forEach(([key, value]) => { if (value) params.set(key, value); });
  const response = await fetch(`${API}/items?${params.toString()}`); if (!response.ok) throw new Error("Could not load items"); return response.json();
}
export async function fetchItem(id) { const response = await fetch(`${API}/items/${id}`); if (!response.ok) throw new Error("Item not found"); return response.json(); }
export async function reportItem(formData) { const response = await fetch(`${API}/items`, { method: "POST", headers: authHeaders(), body: formData }); return readResponse(response, "Could not report item"); }
export async function claimItem(id) { const response = await fetch(`${API}/items/${id}/claim`, { method: "PATCH", headers: authHeaders() }); return readResponse(response, "Could not claim item"); }
export const imageUrl = filename => filename ? `http://localhost:5000/uploads/${encodeURIComponent(filename)}` : "";
