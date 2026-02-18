import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

// ✅ Request Interceptor - Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Response Interceptor - Handle 401 Unauthorized
api.interceptors.response.use(
  response => response,
  error => {
    // If 401 Unauthorized, redirect to login and clear storage
    if (error.response?.status === 401) {
      console.warn("Unauthorized access - redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Dispatch custom event that AuthContext will listen for
      window.dispatchEvent(new Event("UNAUTHORIZED"));
      
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;