import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/button";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../store/authStore"; 

const ResetPassword = () => {
  const { email: paramEmail } = useLocalSearchParams();
  const { resendOTP, isLoading } = useAuthStore();

  const handleResend = async () => {
    // This sends a new Reset Link to the email
    const result = await resendOTP(paramEmail); 
    if (result.success) {
      Alert.alert("Link Sent", "A password reset link has been sent to your email.");
    } else {
      Alert.alert("Error", result.error);
    }
  };

  const openEmailApp = () => {
    // Optional: Helper to open the user's mail app
    Linking.openURL('mailto:');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          
          <View style={styles.topSection}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={COLORS.PRIMARY_COLOR} />
              <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
               <MaterialCommunityIcons name="email-send-outline" size={50} color={COLORS.PRIMARY_COLOR} />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.heading}>Check Your Email</Text>
              <Text style={styles.subText}>We've sent a password reset link to:</Text>
              <Text style={styles.emailHighlight}>{paramEmail || "your email"}</Text>
              
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color="#666" />
                <Text style={styles.infoText}>
                  Click the link in the email to securely reset your password. The link expires in 1 hour.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <Button 
              text="OPEN EMAIL APP" 
              onPress={openEmailApp} 
              style={styles.actionBtn}
            />
            
            <View style={styles.resendSection}>
              <Text style={styles.resendText}>Didn't receive the link? </Text>
              <TouchableOpacity onPress={handleResend} disabled={isLoading}> 
                <Text style={styles.resendLink}>Resend Link</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25 },
  container: { flex: 1, justifyContent: 'space-between', paddingBottom: 40, paddingTop: 10 },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 30 },
  backText: { fontFamily: "Roboto-Medium", fontSize: 16, color: COLORS.PRIMARY_COLOR },
  iconContainer: { backgroundColor: "#F0F9FA", width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 25 },
  textContainer: { alignItems: 'center' },
  heading: { fontSize: 28, fontFamily: "Roboto-Bold", color: "#1A1A1A" },
  subText: { fontSize: 16, fontFamily: "Roboto-Regular", color: "#666", marginTop: 8 },
  emailHighlight: { fontFamily: 'Roboto-Bold', color: COLORS.PRIMARY_COLOR, fontSize: 17, marginTop: 4 },
  infoBox: { flexDirection: 'row', backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, marginTop: 30, alignItems: 'center', gap: 10 },
  infoText: { flex: 1, fontSize: 13, color: '#666', lineHeight: 18 },
  bottomContainer: { marginTop: 40 },
  actionBtn: { height: 56, borderRadius: 12 },
  resendSection: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  resendText: { color: "#777", fontSize: 14 },
  resendLink: { color: COLORS.PRIMARY_COLOR, fontFamily: "Roboto-Bold", fontSize: 14 }
});

export default ResetPassword;