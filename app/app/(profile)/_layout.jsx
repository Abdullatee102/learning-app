import { Stack } from "expo-router";

export default function ProfileLayout() {
  // All screens in this folder will now inherit these options
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false, 
        // animation: 'slide_from_right' // Smooth transition for settings
      }} 
    />
  );
}