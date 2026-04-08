import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/button";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";

const confirmMail = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { resetPassword, isLoading } = useAuthStore();

  const requirements = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const handleResetSubmit = async () => {
    if (Object.values(requirements).includes(false)) {
      return Alert.alert("Security", "Please meet all password requirements.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match.");
    }

    const res = await resetPassword(password);
    if (res.success) {
      router.push("/mailSuccess");
    } else {
      Alert.alert("Failed", res.error || "Could not reset password.");
    }
  };

  const RequirementItem = ({ text, met }) => (
    <View style={styles.reqItem}>
      <Ionicons 
        name={met ? "checkmark-circle" : "ellipse-outline"} 
        size={18} 
        color={met ? "#2E8B57" : "#999"} 
      />
      <Text style={[styles.reqText, met && { color: "#1A1A1A" }]}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              
              <View>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY_COLOR} />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                   <MaterialCommunityIcons name="shield-lock-outline" size={40} color={COLORS.PRIMARY_COLOR} />
                </View>

                <Text style={styles.heading}>New Password</Text>
                <Text style={styles.subText}>Create a strong password you haven't used before.</Text>

                {/* Password Input */}
                <View style={styles.formControl}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Min. 8 characters"
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#666"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password Input */}
                <View style={[styles.formControl, { marginTop: 15 }]}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Re-enter password"
                      secureTextEntry={!showConfirm}
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                      <Ionicons name={showConfirm ? "eye-off-outline" : "eye-outline"} size={20} color="#666" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.reqBox}>
                   <RequirementItem text="At least 8 characters" met={requirements.length} />
                   <RequirementItem text="One uppercase letter" met={requirements.upper} />
                   <RequirementItem text="One number (0-9)" met={requirements.number} />
                   <RequirementItem text="One special character" met={requirements.special} />
                </View>
              </View>

              <View style={styles.bottomContainer}>
                <Button 
                  text={isLoading ? "UPDATING..." : "RESET PASSWORD"} 
                  onPress={handleResetSubmit} 
                  disabled={isLoading}
                  style={styles.actionBtn}
                />
              </View>

            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25 },
  container: { flex: 1, justifyContent: 'space-between', paddingBottom: 40, paddingTop: 10 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 30 },
  backText: { fontFamily: "Roboto-Medium", fontSize: 16, color: COLORS.PRIMARY_COLOR },
  iconContainer: { backgroundColor: "#F0F9FA", width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  heading: { fontSize: 28, fontFamily: "Roboto-Bold", color: "#1A1A1A", marginBottom: 10 },
  subText: { fontSize: 15, fontFamily: "Roboto-Regular", color: "#666", lineHeight: 22, marginBottom: 20 },
  formControl: { gap: 8 },
  label: { fontSize: 14, fontFamily: "Roboto-Bold", color: "#333" },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.PRIMARY_COLOR, borderRadius: 12, height: 56, paddingHorizontal: 15, backgroundColor: "#fff" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, fontFamily: "Roboto-Regular", color: "#1A1A1A" },
  reqBox: { marginTop: 25, gap: 10 },
  reqItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reqText: { fontFamily: "Roboto-Regular", fontSize: 14, color: "#777" },
  bottomContainer: { marginTop: 40 },
  actionBtn: { height: 56, borderRadius: 12 },
});

export default confirmMail;