import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";

const PaymentInfoScreen = () => {
  const router = useRouter();

  const handleAddNewPayment = () => {
    Alert.alert("Coming Soon", "The feature is coming soon, work in progress.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Information</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Active Plan / Subscription */}
        <View style={styles.planCard}>
          <View>
            <Text style={styles.planLabel}>Current Plan</Text>
            <Text style={styles.planTitle}>Premium Library Access</Text>
          </View>
          <Text style={styles.planPrice}>$9.99/mo</Text>
        </View>

        {/* Saved Methods */}
        <Text style={styles.sectionTitle}>Saved Methods</Text>
        <View style={styles.cardItem}>
          <View style={styles.cardBrand}>
            <Ionicons name="card" size={24} color={COLORS.PRIMARY_COLOR} />
            <Text style={styles.cardText}>•••• •••• •••• 4242</Text>
          </View>
          <TouchableOpacity onPress={handleAddNewPayment}>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddNewPayment}>
          <Ionicons name="add" size={20} color={COLORS.PRIMARY_COLOR} />
          <Text style={styles.addBtnText}>Add New Payment Method</Text>
        </TouchableOpacity>

        {/* Transaction History */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Recent Transactions</Text>
        
        <View style={styles.emptyTransactions}>
          <Text style={styles.emptyText}>No transactions made yet</Text>
        </View>
      </ScrollView>

      {/* Security Footer */}
      <View style={styles.footer}>
        <Ionicons name="shield-checkmark" size={16} color="#94A3B8" />
        <Text style={styles.footerText}>Secure SSL Encrypted Payments</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  scroll: { padding: 20 },
  planCard: { 
    backgroundColor: COLORS.PRIMARY_COLOR, 
    padding: 20, 
    borderRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 25 
  },
  planLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  planTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  planPrice: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  cardItem: { 
    backgroundColor: '#FFF', 
    padding: 18, 
    borderRadius: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  cardBrand: { flexDirection: 'row', alignItems: 'center' },
  cardText: { marginLeft: 12, color: '#334155', fontWeight: '500' },
  editBtn: { color: COLORS.PRIMARY_COLOR, fontWeight: '600' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, padding: 10 },
  addBtnText: { color: COLORS.PRIMARY_COLOR, fontWeight: 'bold', marginLeft: 5 },
  emptyTransactions: { 
    paddingVertical: 30, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  emptyText: { 
    fontSize: 14, 
    color: '#94A3B8', 
    fontStyle: 'italic' 
  },
  footer: { padding: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 12, color: '#94A3B8', marginLeft: 6 }
});

export default PaymentInfoScreen;