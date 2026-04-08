import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../components/ui/button";
import COLORS from "../../constants/colors";

const mailSuccess = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.topSection}>
          <View style={styles.successIconWrapper}>
            <Ionicons name="checkmark-done-circle" size={100} color="#2E8B57" />
          </View>

          <Text style={styles.heading}>Success!</Text>
          <Text style={styles.subText}>
            Your password has been updated. You can now sign in with your new credentials.
          </Text>

          <View style={styles.reminderBox}>
            <View style={styles.reminderHeader}>
              <MaterialCommunityIcons name="security" size={24} color={COLORS.PRIMARY_COLOR} />
              <Text style={styles.reminderTitle}>Security Reminder</Text>
            </View>
            <Text style={styles.reminderText}>
              Never share your login details with anyone. We will never ask for your password via chat or email.
            </Text>
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <Button 
            text="BACK TO PRIVACY SECURITY" 
            onPress={() => router.replace("/privacy-security")} 
            style={styles.actionBtn}
          />
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 25, justifyContent: 'space-between', paddingBottom: 40, paddingTop: 60 },
  topSection: { alignItems: 'center' },
  successIconWrapper: { marginBottom: 20 },
  heading: { fontSize: 32, fontFamily: "Roboto-Bold", color: "#1A1A1A", marginBottom: 15 },
  subText: { fontSize: 16, fontFamily: "Roboto-Regular", color: "#666", textAlign: 'center', lineHeight: 24, paddingHorizontal: 10 },
  reminderBox: { marginTop: 40, padding: 20, backgroundColor: "#F0F9FA", borderRadius: 15, width: '100%', borderWidth: 1, borderColor: "#E0F2F4" },
  reminderHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  reminderTitle: { fontFamily: "Roboto-Bold", fontSize: 15, color: "#1A1A1A" },
  reminderText: { fontFamily: "Roboto-Regular", fontSize: 13, color: "#555", lineHeight: 20 },
  bottomContainer: { width: '100%' },
  actionBtn: { height: 56, borderRadius: 12 },
});

export default mailSuccess;