import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore'; 

export default function Index() {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  
  // Added hasFinishedOnboarding to make the flow smarter
  const { user, isCheckingAuth, hasFinishedOnboarding } = useAuthStore();

  useEffect(() => {
    const isNavigationReady = rootNavigationState?.key;

    if (isNavigationReady && !isCheckingAuth) {
      if (user) {
        // User is logged in -> Dashboard
        router.replace('/(tabs)'); 
      } else if (!hasFinishedOnboarding) {
        // First time user -> Onboarding
        router.replace('/onboarding');
      } else {
        // Returning user but logged out -> Sign In
        router.replace('/signIn');
      }
    }
  }, [rootNavigationState?.key, isCheckingAuth, user, hasFinishedOnboarding]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
      <ActivityIndicator size="large" color="#00707E" />
    </View>
  );
}