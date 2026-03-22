import { toast } from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

export const useAuthStore = create(function (set) {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isResending: false,
    message: null,
    isVerifyingAuth: true, // if it's false initially then before verifying auth, the routes will be executed
    // error: null,

    signup: async ({ email, password, name }, navigate) => {
      set({ isLoading: true });
      try {
        const response = await axios.post(`/auth/signup`, {
          email,
          password,
          name
        });
        set({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false
        });
        navigate("/verify-email");
      } catch (error) {
        set({ isLoading: false });
        toast.error(
          error.response.data.message || "Error occurred while signing up!"
        );
        throw error;
      }
    },

    verifyEmail: async function (code) {
      set({ isLoading: true });
      try {
        const response = await axios.post(`/auth/verify-email`, { code });
        set({
          isLoading: false,
          user: response.data.user,
          isAuthenticated: true
        });
        toast.success("Email verified successfully");
      } catch (error) {
        set({ isLoading: false });
        throw new Error(
          error.response.data.message || "Error occurred while verifying email"
        );
      }
    },

    resendVerificationToken: async () => {
      set({ isResending: true });
      try {
        const response = await axios.post(`/auth/resend-verificationToken`);
        set({
          isResending: false
        });
        toast.success(response.data.message);
      } catch (error) {
        set({ isResending: false });
        toast.error(
          error.response.data.message ||
            "Error occurred while resending verification token"
        );
      }
    },

    verifyAuth: async function () {
      try {
        const response = await axios.get(`/auth/profile`);
        set({
          user: response.data.user,
          isAuthenticated: true,
          isVerifyingAuth: false
        });
      } catch (error) {
        if (error.code === "ERR_NETWORK") {
          toast.error("SERVER NETWORK ERROR!");
        }
        set({ isVerifyingAuth: false, isAuthenticated: false });
        // toast.error(
        //   "Not logged in yet? Login now to buy your favourite products" ||
        //     error.response.data.message
        // );
      }
    },

    login: async function ({ email, password }, navigate) {
      set({ isLoading: true });
      try {
        const response = await axios.post(`/auth/login`, {
          email,
          password
        });
        const { user } = response.data;
        set({ user, isAuthenticated: true, isLoading: false });
        navigate("/");
      } catch (error) {
        set({ isLoading: false });
        // setError(`${error.response.data.message} ⚠️⚠️`);
        toast.error(error.response.data.message);
      }
    },

    logout: async function () {
      set({ isLoading: true });
      try {
        await axios.post(`/auth/logout`);
        set({ user: null, isLoading: false, isAuthenticated: false });
      } catch {
        set({ isLoading: false });
        toast.error("Error occurred while logging out!");
      }
    },

    updateProfile: async (update) => {
      set({ isLoading: true });
      try {
        const response = await axios.post(`/auth/update-profile`, update);
        set({
          user: response.data.user,
          message: response.data.message,
          isLoading: false
        });
        toast.success("Profile updated successfully");
      } catch (error) {
        set({ isLoading: false });
        toast.error(
          error.response.data.message || "Error while updating your profile"
        );
      }
    },

    updatePassword: async ({ password, newPassword }) => {
      try {
        if (!password || !newPassword) toast.error("Password is required");
        const response = await axios.post(`/auth/update-password`, {
          password,
          newPassword
        });
        set({ message: response.data.message });
        toast.success("Password updated successfully");
      } catch (error) {
        toast.error(
          error.response.data.message || "Error while updating your password"
        );
      }
    },

    forgotPassword: async function (email) {
      set({ isLoading: true });
      try {
        const response = await axios.post(`/auth/forgot-password`, {
          email
        });
        set({ message: response.data.message, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        toast.error(
          error.response.data.message ||
            "Error while sending password reset link"
        );
      }
    },

    resetPassword: async function ({ resetToken, password }, navigate) {
      set({ isLoading: true });
      try {
        await axios.post(`/auth/reset-password/${resetToken}`, {
          password
        });
        set({ isLoading: false });
        navigate("/login", { replace: true });
        toast.success("Password reset successfully. Now log in");
      } catch (error) {
        set({ isLoading: false });
        toast.error(
          error.response.data.message ||
            "Error occurred while reseting password"
        );
      }
    }
  };
});
