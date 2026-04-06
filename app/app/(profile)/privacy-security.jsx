import React from "react";
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, Switch, Alert, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as LocalAuthentication from 'expo-local-authentication';
import SafeView from "../../components/layout/safeView";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../store/authStore";

const PrivacySecurityScreen = () => {
  const router = useRouter();
  const { biometricsEnabled, setBiometricsEnabled, deleteAccount, isLoading } = useAuthStore();

  const handleBiometricToggle = async () => {
    if (!biometricsEnabled) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        return Alert.alert("Not Supported", "Your device does not support or have biometrics set up.");
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to enable biometric login",
        fallbackLabel: "Use Passcode",
      });

      if (result.success) {
        setBiometricsEnabled(true);
        Alert.alert("Success", "Biometric login enabled.");
      }
    } else {
      setBiometricsEnabled(false);
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Account",
      "This is permanent. All your borrowed books and history will be deleted. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete My Account", 
          style: "destructive", 
          onPress: async () => {
            const res = await deleteAccount();
            if (res.success) {
              Alert.alert("Account Deleted", "We're sorry to see you go.");
              router.replace("/signIn");
            } else {
              Alert.alert("Error", res.error);
            }
          }
        }
      ]
    );
  };

  const SecurityItem = ({ icon, title, subtitle, onPress, isSwitch, value, onValueChange, danger }) => (
    <TouchableOpacity 
      style={styles.itemCard} 
      onPress={onPress} 
      disabled={isSwitch}
    >
      <View style={[styles.iconContainer, danger && { backgroundColor: '#FEE2E2' }]}>
        <Ionicons name={icon} size={22} color={danger ? "#EF4444" : COLORS.PRIMARY_COLOR} />
      </View>
      <View style={styles.itemText}>
        <Text style={[styles.itemTitle, danger && { color: "#EF4444" }]}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      {isSwitch ? (
        <Switch 
          value={value} 
          onValueChange={onValueChange} 
          trackColor={{ false: "#CBD5E0", true: COLORS.PRIMARY_COLOR }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#CBD5E0" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {isLoading && <ActivityIndicator color={COLORS.PRIMARY_COLOR} style={{ marginBottom: 20 }} />}
        
        <Text style={styles.sectionTitle}>Login Security</Text>
        <SecurityItem 
          icon="key-outline" 
          title="Change Password" 
          onPress={() => router.push("/reset-password")} 
        />
        <SecurityItem 
          icon="finger-print-outline" 
          title="Biometric Login" 
          subtitle="Fingerprint or FaceID"
          isSwitch={true}
          value={biometricsEnabled}
          onValueChange={handleBiometricToggle}
        />

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Account Privacy</Text>
        <SecurityItem 
          icon="document-text-outline" 
          title="Privacy Policy" 
          onPress={() => router.push("/privacy-policy")} 
        />
        <SecurityItem 
          icon="trash-outline" 
          title="Delete Account" 
          subtitle="Permanently remove your data"
          danger
          onPress={handleDeletePress}
        />
      </ScrollView>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', marginBottom: 15 },
  itemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  itemText: { flex: 1, marginLeft: 15 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSubtitle: { fontSize: 12, color: '#94A3B8' }
});

export default PrivacySecurityScreen;