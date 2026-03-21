export const API = "http://localhost:8000/api";

const apiFetch = {
  async post(path, body, token) {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async get(path, token, params = {}) {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API}${path}${qs ? "?" + qs : ""}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.json();
  },

  async patch(path, body, token) {
    const res = await fetch(`${API}${path}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  async uploadFile(path, formData, token) {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.json();
  },
};

export default apiFetch;
