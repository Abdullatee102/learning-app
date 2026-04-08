import React from "react";
import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.date}>Last Updated: April 6, 2026</Text>
        
        <Text style={styles.sectionHeader}>Information We Collect</Text>
        <Text style={styles.body}>
          At our E-Learning Library, we value your privacy. To provide a seamless learning experience, we collect:
          {"\n\n"}• *Account Details:* Your name and email for authentication and account management.
          {"\n"}• *Library Progress:* We track borrowed, available, and returned books to sync your library across devices.
          {"\n"}• *Biometric Data:* If enabled, fingerprint or face data is handled strictly by your device's secure hardware. We never see or store this data on our servers.
        </Text>

        <Text style={styles.sectionHeader}>How We Use Your Data</Text>
        <Text style={styles.body}>
          Your information is used solely to maintain your personal library, provide access to educational materials, and ensure the security of your account through Supabase authentication.
        </Text>

        <Text style={styles.sectionHeader}>Data Deletion & Rights</Text>
        <Text style={styles.body}>
          You have full control over your data. You may update your profile information or use the "Delete Account" feature in your settings to permanently remove all personal data and reading history from our systems.
        </Text>

        <Text style={styles.sectionHeader}>Third-Party Services</Text>
        <Text style={styles.body}>
          We utilize Supabase for secure database management and Google/Facebook for optional social authentication. These services have their own privacy policies regarding how they handle your data.
        </Text>
      </ScrollView>

      <View style={styles.stickyFooter}>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>I Understand</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 25, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1E293B', marginBottom: 5 },
  date: { color: '#888', fontSize: 14, marginBottom: 25 },
  sectionHeader: { fontSize: 18, fontWeight: '700', color: COLORS.PRIMARY_COLOR, marginTop: 25, marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 24, color: '#444', textAlign: 'justify' },
  stickyFooter: { 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#EEE', 
    backgroundColor: '#FFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 10
  },
  btn: { backgroundColor: COLORS.PRIMARY_COLOR, padding: 18, borderRadius: 14, alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});

export default PrivacyPolicyScreen;