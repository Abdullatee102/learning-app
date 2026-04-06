import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ActivityIndicator, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SafeView from "../../components/layout/safeView";
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from "../../store/authStore"; 
import { supabase } from "../../lib/supabase"; 
import COLORS from "../../constants/colors";
import { decode } from "base64-arraybuffer"; 
import { useRouter } from "expo-router"; // Use hook for best practice

const ProfileScreen = () => {
  const router = useRouter();
  const { user, logout, setUser } = useAuthStore();
  const [profileImage, setProfileImage] = useState(user?.user_metadata?.avatar_url || null);
  const [isUploading, setIsUploading] = useState(false);

  const getInitial = () => {
    const nameSource = user?.user_metadata?.full_name || user?.email || "U";
    return nameSource.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.user_metadata?.first_name || "User";
  };

  // FIXED: Logic to actually clear session and redirect
  const handleLogOut = () => {
    Alert.alert("Logout", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", 
        style: "destructive", 
        onPress: async () => {
          await logout(); // Clear Supabase session and Zustand state
          router.replace('/signIn'); // Use replace to clear history
        } 
      }
    ]);
  }
  
  const uploadImage = async (uri) => {
    try {
      setIsUploading(true);
      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const response = await fetch(uri);
      const blob = await response.blob();
      const reader = new FileReader();
      
      const base64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setUser(updatedUser.user);
      setProfileImage(publicUrl);
      Alert.alert("Success", "Profile picture updated!");

    } catch (error) {
      console.error("Upload failed:", error);
      Alert.alert("Upload Error", "Check your bucket permissions.");
    } finally {
      setIsUploading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "We need gallery access.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      await uploadImage(result.assets[0].uri);
    }
  };

  return (
    <SafeView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleLogOut} style={styles.logoutCircle}>
            <Ionicons name="log-out-outline" size={22} color="#FF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity 
            onPress={pickImage} 
            style={styles.avatarWrapper}
            disabled={isUploading}
          >
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.initialCircle}>
                <Text style={styles.initialText}>{getInitial()}</Text>
              </View>
            )}
            
            {isUploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator color="#FFF" />
              </View>
            )}

            <View style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.userName}>{getDisplayName()}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionLabel}>Settings</Text>
          
          <MenuOption 
            icon="person-outline" 
            title="Personal Information" 
            color="#007AFF" 
            onPress={() => router.push("/personal-info")}
          />
          
          <MenuOption 
            icon="book-outline" 
            title="Learning Progress" 
            color="#FF9500" 
            onPress={() => router.push("/learning-progress")}
          />
          
          <MenuOption 
            icon="card-outline" 
            title="Payment Information" 
            color="#5856D6" 
            onPress={() => router.push("/payment-info")}
          />
          
          <MenuOption 
            icon="shield-checkmark-outline" 
            title="Privacy & Security" 
            color="#4CD964"
            onPress={() => router.push("/privacy-security")}
          />
          
          <MenuOption 
            icon="help-circle-outline" 
            title="Help & Support" 
            color="#8E8E93"
            onPress={() => router.push("/help-support")}
          />
        </View>

      </ScrollView>
    </SafeView>
  );
};

// FIXED: Passed the onPress prop to the TouchableOpacity
const MenuOption = ({ icon, title, color, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#CCC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  headerTitle: { fontSize: 28, fontFamily: "Roboto-Bold", color: "#1A1A1A" },
  logoutCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF5F5', alignItems: 'center', justifyContent: 'center' },
  profileCard: { alignItems: 'center', marginVertical: 30 },
  avatarWrapper: { width: 120, height: 120, position: 'relative' },
  avatarImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: '#F0F0F0' },
  initialCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center' },
  initialText: { fontSize: 48, fontFamily: "Roboto-Bold", color: "#fff" },
  uploadOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 60, justifyContent: 'center', alignItems: 'center' },
  cameraBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: COLORS.PRIMARY_COLOR, padding: 8, borderRadius: 20, borderWidth: 3, borderColor: "#fff" },
  userName: { fontSize: 24, fontFamily: "Roboto-Bold", color: "#1A1A1A", marginTop: 15 },
  userEmail: { fontSize: 14, fontFamily: "Roboto-Regular", color: "#666", marginTop: 4 },
  sectionLabel: { fontSize: 13, fontFamily: "Roboto-Bold", color: "#BBB", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 15, marginTop: 10 },
  menuContainer: { gap: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: "#FFF", borderRadius: 16, borderWidth: 1, borderColor: '#F0F0F0' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  iconBox: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuText: { fontSize: 16, fontFamily: "Roboto-Medium", color: "#333" },
});

export default ProfileScreen;