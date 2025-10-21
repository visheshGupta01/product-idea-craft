import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/config/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle expired tokens
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if this is a login or signup request - don't try to refresh tokens for these
    const isAuthRequest =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/signup") ||
      originalRequest.url?.includes("/auth/refresh-token");

    // Check if the error is 401 (Unauthorized) and we haven't already tried to refresh
    // Skip token refresh for auth requests
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      //console.log("Token expired, attempting to refresh...");
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        //console.log("Refresh Token: " + refreshToken);
        if (!refreshToken) {
          // No refresh token available, redirect to login
          //console.error("No refresh token available");
          //console.log("No refresh token available, redirecting to login.");
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/";
          return Promise.reject(error);
        }

        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          }
        );

        const data = refreshResponse.data;
        //console.log(data);

        if (data.success && data.token) {
          // Update tokens in localStorage
          //console.log("Token refreshed successfully");
          localStorage.setItem("auth_token", data.token);
          localStorage.setItem("refresh_token", data.refreshToken);
          localStorage.setItem("user_role", data.role);

          // Update the authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${data.token}`;

          // Retry the original request with the new token
          return apiClient(originalRequest);
        } else {
          // Refresh failed, redirect to login
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/";
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh request failed, redirect to login
        //console.error("Token refresh failed:", refreshError);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
