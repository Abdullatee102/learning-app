import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

// Auth Libraries
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";

// Project Resources
import Button from "../components/ui/button";
import COLORS from "../constants/colors";
import { useAuthStore } from "../store/authStore";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Pulling actions and loading state from the Store
  const { login, googleLogin, facebookLogin, forgotPassword, isLoading } = useAuthStore();

  // --- 1. EMAIL/PASSWORD LOGIN ---
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Login Failed", result.error);
    }
  };

  // --- 2. GOOGLE LOGIN ---
  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data?.idToken) {
        const result = await googleLogin(userInfo.data.idToken);
        if (result.success) router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Google Error", error.message);
    }
  };

  // --- 3. FACEBOOK LOGIN ---
  const handleFacebookSignIn = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(["public_profile", "email"]);
      if (result.isCancelled) return;

      const tokenData = await AccessToken.getCurrentAccessToken();
      if (!tokenData) throw new Error("Failed to get Facebook token");

      const res = await facebookLogin(tokenData.accessToken);
      if (res.success) router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Facebook Error", error.message);
    }
  };

  // --- 4. FORGOT PASSWORD ---
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Email Required", "Please enter your email address to reset your password.");
      return;
    }
    const result = await forgotPassword(email);
    if (result.success) {
      Alert.alert("Success", "Password reset link sent to your email!");
    } else {
      Alert.alert("Error", result.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>SIGN IN</Text>
            <Text style={styles.subTitle}>Sign In To Access Your Personalized Learning Journey</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.forgotBtn} onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Action Button */}
          <View style={styles.buttonWrapper}>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
            ) : (
              <Button text="SIGN IN" onPress={handleSignIn} style={styles.signInBtn} />
            )}
          </View>

          {/* Divider */}
          <View style={styles.dividerWrapper}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Or Sign In with</Text>
            <View style={styles.line} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialWrapper}>
            <TouchableOpacity 
              style={styles.socialBtnFacebook} 
              onPress={handleFacebookSignIn}
            >
              <FontAwesome name="facebook" size={20} color="#fff" />
              <Text style={styles.socialBtnTextWhite}>Sign In With Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialBtnGoogle} 
              onPress={handleGoogleSignIn}
            >
              <Image 
                source={require("../assets/logos/google-logo.png")} 
                style={styles.googleIcon} 
              />
              <Text style={styles.socialBtnTextBlack}>Sign In With Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an Account? </Text>
            <TouchableOpacity onPress={() => router.push("/signUp")}>
              <Text style={styles.footerLink}>Sign Up here</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingBottom: 40 
  },
  header: { 
    paddingVertical: 15 
  },
  backBtn: { 
    alignSelf: "flex-start" 
  },
  titleSection: { 
    alignItems: "center", 
    marginVertical: 40 
  },
  mainTitle: { 
    fontFamily: 'Roboto-Bold', 
    fontSize: 28, 
    color: COLORS.PRIMARY_COLOR, 
    letterSpacing: 1, 
    marginBottom: 15 
  },
  subTitle: { 
    fontFamily: 'Roboto-Regular', 
    fontSize: 14, 
    color: "#777", 
    textAlign: "center", 
    lineHeight: 22, 
    paddingHorizontal: 30 
  },
  formSection: { 
    gap: 20, 
    marginBottom: 30 
  },
  inputGroup: { 
    gap: 8 
  },
  label: { 
    fontFamily: 'Roboto-Bold', 
    fontSize: 14, 
    color: "#333", 
    paddingLeft: 2 
  },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    borderWidth: 1.5, 
    borderColor: COLORS.PRIMARY_COLOR, 
    borderRadius: 10, 
    paddingHorizontal: 15, 
    height: 54, 
    backgroundColor: "#fff" 
  },
  input: { 
    flex: 1, 
    fontFamily: 'Roboto-Regular', 
    fontSize: 14, 
    color: "#333" 
  },
  forgotBtn: { 
    alignSelf: "flex-end", 
    marginTop: 2 
  },
  forgotText: { 
    fontFamily: 'Roboto-Regular', 
    fontSize: 12, 
    color: "#888" 
  },
  buttonWrapper: { 
    alignItems: "center", 
    marginBottom: 45 
  },
  signInBtn: { 
    width: "100%", 
    height: 54 
  },
  dividerWrapper: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12, 
    marginBottom: 30 
  },
  line: { 
    flex: 1, 
    height: 1, 
    backgroundColor: "#E0E0E0" 
  },
  dividerText: { 
    fontFamily: 'Roboto-Regular', 
    fontSize: 13, 
    color: "#888" 
  },
  socialWrapper: { 
    gap: 15, 
    marginBottom: 40 
  },
  socialBtnFacebook: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 12, 
    backgroundColor: "#1877F2", 
    height: 54, 
    borderRadius: 10 
  },
  socialBtnGoogle: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    gap: 12, 
    backgroundColor: "#fff", 
    borderWidth: 1, 
    borderColor: "#E0E0E0", 
    height: 54, 
    borderRadius: 10 
  },
  googleIcon: { 
    width: 20, 
    height: 20, 
    resizeMode: "contain" 
  },
  socialBtnTextWhite: { 
    fontFamily: 'Roboto-Bold', 
    color: "#fff", 
    fontSize: 14 
  },
  socialBtnTextBlack: { 
    fontFamily: 'Roboto-Bold', 
    color: "#444", 
    fontSize: 14 
  },
  footer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  footerText: { 
    fontFamily: 'Roboto-Regular', 
    fontSize: 13, 
    color: "#888" 
  },
  footerLink: { 
    fontFamily: 'Roboto-Bold', 
    fontSize: 13, 
    color: "#333", 
    textDecorationLine: "underline" 
  },
});