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
  Image,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/button";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, isLoading } = useAuthStore();

  const handleSendLink = async () => {
    if (!email) {
      return Alert.alert("Error", "Please enter a valid email address");
    }

    const res = await forgotPassword(email);
    if (res.success) {
      Alert.alert(
        "Link Sent",
        "A password reset link has been sent to your email. Please check your inbox.",
        [{ text: "OK", onPress: () => router.push({ pathname: "/resetPassword", params: { email: email } }) }]
      );
    } else {
      Alert.alert("Request Failed", res.error);
    }
  };

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
              
              {/* Top Section */}
              <View>
                <TouchableOpacity 
                  onPress={() => router.push('/signIn')} 
                  style={styles.backBtn}
                >
                  <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY_COLOR} />
                  <Text style={styles.backText}>Back to Login</Text>
                </TouchableOpacity>

                <View style={styles.iconContainer}>
                   <MaterialCommunityIcons name="lock-reset" size={40} color={COLORS.PRIMARY_COLOR} />
                </View>

                <Text style={styles.heading}>Forgot Password?</Text>
                <Text style={styles.subText}>
                  Don't worry! Enter the email linked to your account and we'll send you a reset link.
                </Text>

                <View style={styles.formControl}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="example@mail.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              {/* Bottom Section */}
              <View style={styles.bottomContainer}>
                <Button 
                  text={isLoading ? "SENDING..." : "SEND RESET LINK"} 
                  onPress={handleSendLink} 
                  disabled={isLoading}
                  style={styles.actionBtn}
                />
                
                <View style={styles.helperBox}>
                  <Ionicons name="information-circle-outline" size={20} color={COLORS.PRIMARY_COLOR} />
                  <Text style={styles.helperText}>
                    Check your spam or junk folder if you don't see the email within a few minutes.
                  </Text>
                </View>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 10,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 30,
  },
  backText: {
    fontFamily: "Roboto-Medium",
    fontSize: 16,
    color: COLORS.PRIMARY_COLOR,
  },
  iconContainer: {
    backgroundColor: "#F0F9FA",
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontFamily: "Roboto-Bold",
    color: "#1A1A1A",
    marginBottom: 10,
  },
  subText: {
    fontSize: 15,
    fontFamily: "Roboto-Regular",
    color: "#666",
    lineHeight: 22,
    marginBottom: 30,
  },
  formControl: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    color: "#333",
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_COLOR,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Roboto-Regular",
    color: "#1A1A1A",
  },
  bottomContainer: {
    marginTop: 40,
  },
  actionBtn: {
    height: 56,
    borderRadius: 12,
  },
  helperBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EEE",
    borderRadius: 12,
    gap: 12,
  },
  helperText: {
    fontFamily: "Roboto-Regular",
    fontSize: 13,
    color: "#777",
    flex: 1,
  },
});

export default ForgotPassword;