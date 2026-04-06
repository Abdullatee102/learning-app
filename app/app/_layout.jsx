import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router'; 
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthStore } from '../store/authStore'; 
import { supabase } from '../lib/supabase'; 

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, setUser, isCheckingAuth, checkAuth } = useAuthStore(); 
  const router = useRouter(); 
  const segments = useSegments(); 
  const url = Linking.useURL(); // Catch deep links (Magic Links)

  // --- 1. LOAD CUSTOM FONTS ---
  const [fontsLoaded, fontError] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto/static/Roboto_Condensed-Regular.ttf'),
    'Roboto-Bold': require('../assets/fonts/Roboto/static/Roboto_Condensed-Bold.ttf'),
    'Roboto-Light': require('../assets/fonts/Roboto/static/Roboto_Condensed-Light.ttf'),
    'Roboto-Black': require('../assets/fonts/Roboto/static/Roboto_Condensed-Black.ttf'),
    'Roboto-Italic': require('../assets/fonts/Roboto/static/Roboto_Condensed-Italic.ttf'),
  });

  // --- 2. CONFIGURE GOOGLE SIGNIN ---
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '763401545805-4bol739bi7rtdjifc9hpdocj20qtmvt2.apps.googleusercontent.com',
      offlineAccess: true,
      accountName: '',
    });
  }, []);

  // --- 3. AUTH STATE & DEEP LINK LISTENER ---
  useEffect(() => {
    // Initial check
    checkAuth();

    // Listen for Supabase Auth changes (handles login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // Handle Deep Link if app is already open or just opening
    if (url) {
      const { path, hostname } = Linking.parse(url);
      if (path === 'auth-callback' || hostname === 'auth-callback') {
        supabase.auth.getSession().then(({ data }) => {
          if (data?.session) setUser(data.session.user);
        });
      }
    }

    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, [setUser, checkAuth, url]);

  // --- 4. NAVIGATION GUARDS ---
  useEffect(() => {
   if (isCheckingAuth || !fontsLoaded) return;

   // 1. Define the screens that ONLY logged-out people see
   const authGroup = ['signIn', 'signUp', 'onboarding', 'onboarding2', 'index', '(auth)']; 

  
   // 2. Check if the current screen is one of those
   const isAuthScreen = authGroup.includes(segments[0]);

   // 3. Simple Logic:
   if (!user && !isAuthScreen) {
    // If NOT logged in and trying to access a private screen -> Go to Sign In
    router.replace('/signIn');
   } else if (user && isAuthScreen) {
    // If ALREADY logged in and trying to access auth screens -> Go to App
    router.replace('/(tabs)');
   }
  
   // Notice: If you are logged in and go to 'reader' or 'personal-info', 
   // nothing happens because they aren't in 'authGroup'. This is what we want!
  }, [user, isCheckingAuth, segments, fontsLoaded]);

  // --- 5. HIDE SPLASH SCREEN ---
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
      {/* Entry point */}
      <Stack.Screen name="index" />

      {/* Reader: Modal presentation hides bottom tabs automatically */}
      <Stack.Screen 
        name="reader" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: "Reading Mode",
          headerTitleStyle: { fontFamily: 'Roboto-Bold' }
        }} 
      />

      {/* Onboarding & Auth Screens */}
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="onboarding2" />
      <Stack.Screen name="signUp" />
      <Stack.Screen name="signIn" />
      
      {/* Grouped Routes */}
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(profile)" />
    </Stack>
  );
}