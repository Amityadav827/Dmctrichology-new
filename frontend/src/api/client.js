import axios from "axios";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocal ? "http://localhost:10000/api" : "https://dmctrichology-1.onrender.com/api"),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dmc_admin_token");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API DEBUG] Injecting token for ${config.url}`, token.substring(0, 10) + "...");
  } else {
    console.warn(`[API DEBUG] No token found in localStorage for ${config.url}`);
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || "";
    const isAuthFailure = status === 401 && message.toLowerCase().includes("token");

    if (isAuthFailure) {
      localStorage.removeItem("dmc_admin_token");
      localStorage.removeItem("dmc_admin_user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
