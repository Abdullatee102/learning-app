import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // --- INITIAL STATES ---
      user: null,
      isLoading: false,
      isCheckingAuth: true,
      hasFinishedOnboarding: false,
      biometricsEnabled: false, 

      // --- ONBOARDING & BIOMETRICS ---
      setHasFinishedOnboarding: (value) => set({ hasFinishedOnboarding: value }),
      setBiometricsEnabled: (value) => set({ biometricsEnabled: value }), 

      // --- STANDARD LOGIN (for Email/Password) ---
      login: async (email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
        set({ user: data.user, isLoading: false, isCheckingAuth: false });
        return { success: true, user: data.user };
      },

      // --- REGISTER (for Email/Password) ---
      register: async (firstName, lastName, email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'e-learning-app://resetPassword',
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`,
            },
          },
        });
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
        set({ user: data.user, isLoading: false, isCheckingAuth: false });
        return { success: true, data };
      },

      // --- VERIFY OTP (Email Signup) ---
      verifyOTP: async (token, email) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' });
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
        set({ user: data.user, isLoading: false, isCheckingAuth: false });
        return { success: true, user: data.user };
      },

      // --- VERIFY RESET OTP ---
      verifyResetOTP: async (token, email) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' });
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
        set({ user: data.user, isLoading: false });
        return { success: true };
      },

      // --- NATIVE GOOGLE LOGIN FLOW ---
      googleLogin: async (idToken) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithIdToken({ provider: "google", token: idToken });
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
        set({ user: data.user, isLoading: false, isCheckingAuth: false });
        return { success: true, user: data.user };
      },

      // --- NATIVE FACEBOOK LOGIN FLOW ---
      facebookLogin: async (accessToken) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithIdToken({ provider: "facebook", token: accessToken });
        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
        set({ user: data.user, isLoading: false, isCheckingAuth: false });
        return { success: true, user: data.user };
      },

      // --- FORGOT PASSWORD (Email Request) ---
      forgotPassword: async (email) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        set({ isLoading: false });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- RESEND OTP ---
      resendOTP: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- RESET PASSWORD / UPDATE PASSWORD ---
      resetPassword: async (newPassword) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        set({ isLoading: false });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- UPDATE EMAIL ---
      updateEmail: async (newEmail) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        set({ isLoading: false });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- AUTH CHECK (App Startup) ---
      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          set({ user: session?.user ?? null, isCheckingAuth: false });
          return session?.user ?? null;
        } catch (error) {
          set({ user: null, isCheckingAuth: false });
          return null;
        }
      },

      // --- LOGOUT ---
      logout: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
          set({ user: null, isCheckingAuth: false, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // --- DELETE ACCOUNT ---
      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          // Get the session manually
          const { data: { session } } = await supabase.auth.getSession();
    
          if (!session?.access_token) {
            throw new Error("No active session found. Please log in again.");
          }

          const { data, error } = await supabase.functions.invoke('delete-user-account', {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });

          if (error) {
            const errorBody = await error.context?.json();
            throw new Error(errorBody?.error || "Deletion failed on server");
          }

          // Clear local auth
          await supabase.auth.signOut();
          set({ user: null, biometricsEnabled: false, isLoading: false });
          return { success: true };

        } catch (error) {
          set({ isLoading: false });
          console.error("Delete Account Error:", error.message);
          return { success: false, error: error.message };
        }
      },

      // --- MANUAL STATE UPDATE ---
      setUser: (user) => set({ user, isCheckingAuth: false, isLoading: false }),

    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user,
        hasFinishedOnboarding: state.hasFinishedOnboarding,
        biometricsEnabled: state.biometricsEnabled 
      }),
    }
  )
);
