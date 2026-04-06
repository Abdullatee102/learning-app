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
      biometricsEnabled: false, // NEW

      // --- ONBOARDING ---
      setHasFinishedOnboarding: (value) => set({ hasFinishedOnboarding: value }),
      setBiometricsEnabled: (value) => set({ biometricsEnabled: value }), // NEW

      // --- 1. STANDARD LOGIN (Email/Password) ---
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

      // --- 2. REGISTER (Email/Password) ---
      register: async (firstName, lastName, email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'e-learning-app://auth-callback',
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

      // --- 3. VERIFY OTP (Email Signup) ---
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

      // --- 3.1 VERIFY RESET OTP ---
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

      // --- 4. NATIVE GOOGLE LOGIN FLOW ---
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

      // --- 5. NATIVE FACEBOOK LOGIN FLOW ---
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

      // --- 6. FORGOT PASSWORD (Email Request) ---
      forgotPassword: async (email) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        set({ isLoading: false });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- 6.1 RESEND OTP ---
      resendOTP: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- 7. RESET PASSWORD / UPDATE PASSWORD ---
      resetPassword: async (newPassword) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        set({ isLoading: false });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- 7.1 UPDATE EMAIL (NEW) ---
      updateEmail: async (newEmail) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        set({ isLoading: false });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- 8. AUTH CHECK (App Startup) ---
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

      // --- 9. LOGOUT ---
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

      // --- 10. DELETE ACCOUNT (NEW - Calling Edge Function) ---
      deleteAccount: async () => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.functions.invoke('delete-user-account');
          if (error) throw error;
          
          await supabase.auth.signOut();
          set({ user: null, biometricsEnabled: false, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // --- 11. MANUAL STATE UPDATE ---
      setUser: (user) => set({ user, isCheckingAuth: false, isLoading: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        hasFinishedOnboarding: state.hasFinishedOnboarding,
        biometricsEnabled: state.biometricsEnabled 
      }),
    }
  )
);