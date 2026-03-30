import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { GoogleSignin } from '@react-native-google-signin/google-signin'; // Added this
import { useAuthStore } from '../store/authStore'; 
import { supabase } from '../lib/supabase'; 

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setUser, isCheckingAuth, checkAuth } = useAuthStore();
  
  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto/static/Roboto_Condensed-Light.ttf'),
    'Roboto-Black': require('../assets/fonts/Roboto/static/Roboto_Condensed-Black.ttf'),
    'Roboto-Italic': require('../assets/fonts/Roboto/static/Roboto_Condensed-Italic.ttf'),
  });

  // 1. Configure Native Social Logins
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '763401545805-4bol739bi7rtdjifc9hpdocj20qtmvt2.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  // 2. Handle Auth Session & Listeners
  useEffect(() => {
    // Initial session check
    checkAuth();

    // Listen for changes (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, [setUser, checkAuth]); 

  // 3. Handle Splash Screen Visibility
  useEffect(() => {
    if ((fontsLoaded || fontError) && !isCheckingAuth) {
      SplashScreen.hideAsync().catch((err) => {
        console.warn("Error hiding splash screen:", err);
      });
    }
  }, [fontsLoaded, fontError, isCheckingAuth]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="signIn" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}