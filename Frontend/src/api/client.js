import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post(
        "/auth/refresh",
        { refreshToken: localStorage.getItem("refreshToken") },
        { skipRefresh: true }
      )
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        if (res.data.refreshToken) {
          localStorage.setItem("refreshToken", res.data.refreshToken);
        }
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.skipRefresh) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshAccessToken();

        return api.request(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        if (!originalRequest.silentAuth) {
          toast.error("Please LogIn", { id: "auth" });
        }

        if (refreshError instanceof Error) {
          refreshError._authToastShown = true;
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api };