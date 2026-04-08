import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import Button from "../components/ui/button";
import COLORS from "../constants/colors";
import { useAuthStore } from "../store/authStore";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, googleLogin, facebookLogin, isLoading } = useAuthStore();

  const handleSignUp = async () => {
    if (!email || !password || !firstName) {
      return Alert.alert("Error", "Please fill in all required fields");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match");
    }

    const result = await register(firstName, lastName, email, password);
    if (result.success) {
      router.replace({
        pathname: "/(auth)/verifyOtp",
        params: { email: email },
      });
    } else {
      Alert.alert("Sign Up Error", result.error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      try {
        await GoogleSignin.signOut();
      } catch (error) {
        // This fails silently if no user is signed in
      }
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data?.idToken) {
        const res = await googleLogin(userInfo.data.idToken);
        if (res.success) router.replace("/(tabs)");
      }
    } catch (e) {
      Alert.alert("Google Error", e.message);
    }
  };

  const handleFacebookAuth = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(["public_profile"]);
      if (result.isCancelled) return;

      const tokenData = await AccessToken.getCurrentAccessToken();
      if (tokenData) {
        const res = await facebookLogin(tokenData.accessToken);
        if (res.success) router.replace("/(tabs)");
      }
    } catch (e) {
      Alert.alert("Facebook Error", e.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY_COLOR} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>SIGN UP</Text>
            <Text style={styles.subtitle}>
              Create your account to embark on your educational adventure
            </Text>
          </View>

          {/* Registration Form */}
          <View style={styles.form}>
            <CustomInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
            />
            <CustomInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            />
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.flexInput}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.flexInput}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <View style={styles.actionSection}>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
            ) : (
              <Button text="SIGN UP" onPress={handleSignUp} style={styles.mainButton} />
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Or Sign Up with</Text>
            <View style={styles.line} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialGroup}>
            <SocialButton
              icon="facebook"
              text="Facebook"
              onPress={handleFacebookAuth}
              color="#1877F2"
              isFontAwesome={true}
            />
            <SocialButton
              icon={require("../assets/logos/google-logo.png")}
              text="Google"
              onPress={handleGoogleAuth}
              isImage={true}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signIn")}>
              <Text style={styles.footerLink}>Sign In here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Helper Components ---
const CustomInput = ({ label, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.singleInput}
      placeholderTextColor="#999"
      {...props}
    />
  </View>
);

const SocialButton = ({ icon, text, onPress, color, isFontAwesome, isImage }) => (
  <TouchableOpacity
    style={[styles.socialBtn, color ? { backgroundColor: color } : styles.whiteBtn]}
    onPress={onPress}
  >
    {isFontAwesome && <FontAwesome name={icon} size={20} color="#fff" />}
    {isImage && <Image source={icon} style={styles.socialIcon} />}
    <Text style={[styles.socialText, color ? { color: "#fff" } : { color: "#444" }]}>
      Sign Up with {text}
    </Text>
  </TouchableOpacity>
);

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 10,
  },
  headerTextContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  title: {
    fontFamily: "Roboto-Bold",
    fontSize: 28,
    color: COLORS.PRIMARY_COLOR,
  },
  subtitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 5,
  },
  label: {
    fontFamily: "Roboto-Bold",
    fontSize: 13,
    color: "#333",
  },
  singleInput: {
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_COLOR,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_COLOR,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
  },
  flexInput: {
    flex: 1,
    height: "100%",
    fontFamily: "Roboto-Regular",
    color: "#000",
  },
  actionSection: {
    marginTop: 30,
    alignItems: "center",
  },
  mainButton: {
    width: "100%",
    height: 50,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#EEE",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#999",
    fontSize: 12,
  },
  socialGroup: {
    gap: 12,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    gap: 10,
  },
  whiteBtn: {
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#fff",
  },
  socialIcon: {
    width: 18,
    height: 18,
  },
  socialText: {
    fontFamily: "Roboto-Bold",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#888",
  },
  footerLink: {
    fontFamily: "Roboto-Bold",
    color: COLORS.PRIMARY_COLOR,
    textDecorationLine: "underline",
  },
});
