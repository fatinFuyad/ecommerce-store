import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isVerifyingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ isLoading: true });

    if (password !== confirmPassword) {
      set({ isLoading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      set({ user: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });

      set({ user: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during logout"
      );
    }
  },

  checkAuth: async () => {
    set({ isVerifyingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, isVerifyingAuth: false });
    } catch (error) {
      set({ isVerifyingAuth: false, user: null });
    }
  },

  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().isVerifyingAuth) return;

    set({ isVerifyingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ isVerifyingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, isVerifyingAuth: false });
      throw error;
    }
  }
}));

// TODO: Implement the axios interceptors for refreshing access token

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
