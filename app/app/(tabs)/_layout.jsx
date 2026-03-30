import { FontAwesome5, MaterialCommunityIcons, Octicons} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, } from "expo-router";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00707E",
        tabBarInactiveTintColor: "#000000",
        tabBarPressColor: "transparent",
        tabBarPressOpacity: 1,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "900",
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          paddingTop: 5,
          height: 60 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused, color, size }) => (
            <Octicons
              name={focused ? "home-fill" : "home"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Book",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "book-open-variant" : "book-open-variant-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Message",
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name={focused ? "message-reply-text" : "message-reply-text-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome5
              name={focused ? "user-alt" : "user"}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
