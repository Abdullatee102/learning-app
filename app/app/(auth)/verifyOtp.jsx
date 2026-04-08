import React, { useRef, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/authStore";
import Load from "../../components/ui/load";
import COLORS from "../../constants/colors";

const CODE_LENGTH = 6;

export default function EmailVerificationScreen() {
  const router = useRouter();
  const { user, verifyOTP, isLoading } = useAuthStore();
  const params = useLocalSearchParams();
  
  const [email, setEmail] = useState(params.email || user?.email || "");
  const [otp, setOtp] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(30); 
  const inputs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const timer = setTimeout(() => inputs.current[0]?.focus(), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = async (code) => {
  if (code.length !== CODE_LENGTH) return;
  
  Keyboard.dismiss();
  setError(""); 

  // 1. Call the store
  const result = await verifyOTP(code, email);
  
  if (result.success) {
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 100); 
  } else {
    setError(result.error || "Invalid verification code");
    setOtp(Array(CODE_LENGTH).fill("")); 
    inputs.current[0]?.focus();
  }
};

  const handleChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); 
    setOtp(newOtp);

    if (text && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join("");
    if (fullCode.length === CODE_LENGTH) {
      handleVerify(fullCode);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Load visible={isLoading} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.iconBox}>
              <Ionicons name="mail-unread-outline" size={32} color={COLORS.PRIMARY_COLOR} />
            </View>

            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to</Text>
            <Text style={styles.emailText}>{email}</Text>

            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(el) => (inputs.current[i] = el)}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                    activeIndex === i && styles.activeInput,
                    error ? styles.errorInput : null,
                  ]}
                  value={digit}
                  keyboardType="number-pad"
                  maxLength={1}
                  onFocus={() => setActiveIndex(i)}
                  onChangeText={(text) => handleChange(text, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  editable={!isLoading} // Disable while loading
                />
              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.verifyBtn, { opacity: isLoading ? 0.6 : 1 }]}
              onPress={() => handleVerify(otp.join(""))}
              disabled={isLoading || otp.join("").length < 6}
            >
              <Text style={styles.verifyText}>
                {isLoading ? "Verifying..." : "Verify & Proceed"}
              </Text>
            </TouchableOpacity>

            {/* ... Resend UI ... */}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#F0F9FA",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontFamily: "Roboto-Bold",
    fontSize: 28,
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    color: "#666",
  },
  emailText: {
    fontFamily: "Roboto-Bold",
    fontSize: 16,
    color: COLORS.PRIMARY_COLOR,
    marginBottom: 40,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
    textAlign: "center",
    fontSize: 22,
    fontFamily: "Roboto-Bold",
    color: "#1A1A1A",
  },
  activeInput: {
    borderColor: COLORS.PRIMARY_COLOR,
    backgroundColor: "#fff",
  },
  otpInputFilled: {
    borderColor: COLORS.PRIMARY_COLOR,
  },
  errorInput: {
    borderColor: "#FF4D4D",
  },
  errorText: {
    color: "#FF4D4D",
    fontFamily: "Roboto-Regular",
    marginBottom: 20,
  },
  verifyBtn: {
    width: "100%",
    height: 56,
    backgroundColor: COLORS.PRIMARY_COLOR,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  verifyText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Roboto-Bold",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendGray: {
    fontFamily: "Roboto-Regular",
    color: "#666",
    fontSize: 15,
  },
  resendLink: {
    fontFamily: "Roboto-Bold",
    color: COLORS.PRIMARY_COLOR,
    fontSize: 15,
  },
});