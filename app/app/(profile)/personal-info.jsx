import React, { useState } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore"; 
import { supabase } from "../../lib/supabase"; 
import COLORS from "../../constants/colors";


const InputField = ({ label, value, onChangeText, placeholder, keyboardType = "default" }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#AAA"
      keyboardType={keyboardType}
      autoCapitalize="words"
    />
  </View>
);

const PersonalInfoScreen = () => {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  const [firstName, setFirstName] = useState(user?.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(user?.user_metadata?.last_name || "");
  const [phone, setPhone] = useState(user?.user_metadata?.phone_number || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Error", "First and Last name are required.");
      return;
    }

    try {
      setIsSaving(true);

      // Updating Supabase Auth Metadata
      const { data, error } = await supabase.auth.updateUser({
        data: { 
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          phone_number: phone.trim()
        }
      });

      if (error) throw error;

      // Syncing the local Zustand store with updated user data
      setUser(data.user);
      
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Update Failed", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Information</Text>
          <View style={{ width: 40 }} /> 
        </View>

        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.subtitle}>Update your details to keep your account current.</Text>

          <InputField 
            label="First Name" 
            value={firstName} 
            onChangeText={setFirstName} 
            placeholder="Enter your first name" 
          />
          
          <InputField 
            label="Last Name" 
            value={lastName} 
            onChangeText={setLastName} 
            placeholder="Enter your last name" 
          />

          <InputField 
            label="Phone Number" 
            value={phone} 
            onChangeText={setPhone} 
            placeholder="+234..." 
            keyboardType="phone-pad"
          />

          {/* Read-only Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.input, styles.disabledInput]}>
              <Text style={styles.disabledText}>{user?.email}</Text>
              <Ionicons name="lock-closed" size={16} color="#CCC" />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} 
            onPress={handleUpdate}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  backBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: "#F5F5F5", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  headerTitle: { 
    fontSize: 18, 
    fontFamily: "Roboto-Bold", 
    color: "#1A1A1A" 
  },
  content: { 
    paddingHorizontal: 25, 
    paddingTop: 10,
    paddingBottom: 30
  },
  subtitle: { 
    fontSize: 14, 
    fontFamily: "Roboto-Regular", 
    color: "#666", 
    marginBottom: 30 
  },
  inputGroup: { marginBottom: 20 },
  label: { 
    fontSize: 14, 
    fontFamily: "Roboto-Bold", 
    color: "#333", 
    marginBottom: 8 
  },
  input: { 
    height: 55, 
    backgroundColor: "#F9F9F9", 
    borderRadius: 12, 
    paddingHorizontal: 15, 
    fontSize: 16, 
    fontFamily: "Roboto-Regular", 
    color: "#333", 
    borderWidth: 1, 
    borderColor: "#EEE" 
  },
  disabledInput: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    backgroundColor: "#F2F2F2" 
  },
  disabledText: { 
    color: "#999", 
    fontFamily: "Roboto-Regular" 
  },
  saveBtn: { 
    height: 55, 
    backgroundColor: COLORS.PRIMARY_COLOR, 
    borderRadius: 15, 
    alignItems: "center", 
    justifyContent: "center", 
    marginTop: 20, 
    shadowColor: COLORS.PRIMARY_COLOR, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 5 
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontFamily: "Roboto-Bold" 
  },
});

export default PersonalInfoScreen;