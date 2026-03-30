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

      // --- ONBOARDING ---
      setHasFinishedOnboarding: (value) => set({ hasFinishedOnboarding: value }),

      // --- 1. STANDARD LOGIN (Email/Password) ---
      login: async (email, password) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

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
            data: {
              first_name: firstName,
              last_name: lastName,
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
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup', 
        });

        if (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }

        set({ user: data.user, isLoading: false, isCheckingAuth: false });
        return { success: true, user: data.user };
      },

      // --- 4. NATIVE GOOGLE LOGIN FLOW ---
      googleLogin: async (idToken) => {
        set({ isLoading: true });
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: idToken,
        });

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
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "facebook",
          token: accessToken,
        });

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
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'com.abdullateef.elearning://reset-password', 
        });

        set({ isLoading: false });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- 7. RESET PASSWORD (Final Submission) ---
      resetPassword: async (newPassword) => {
        set({ isLoading: true });
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        set({ isLoading: false });
        if (error) return { success: false, error: error.message };
        return { success: true };
      },

      // --- 8. AUTH CHECK (App Startup) ---
      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const { data: { session } } = await supabase.auth.getSession();
          set({ 
            user: session?.user ?? null, 
            isCheckingAuth: false 
          });
          return session?.user ?? null;
        } catch (error) {
          set({ user: null, isCheckingAuth: false });
          return null;
        }
      },

      // --- 9. LOGOUT ---
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isCheckingAuth: false });
      },

      // --- 10. MANUAL STATE UPDATE ---
      setUser: (user) => set({ 
        user, 
        isCheckingAuth: false, 
        isLoading: false 
      }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hasFinishedOnboarding: state.hasFinishedOnboarding }),
    }
  )
);