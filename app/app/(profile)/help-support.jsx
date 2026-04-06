import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, LayoutAnimation, Platform, UIManager } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQItem = ({ question, answer }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.faqContainer}>
      <TouchableOpacity style={styles.faqHeader} onPress={toggleExpand} activeOpacity={0.7}>
        <Text style={styles.questionText}>{question}</Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={COLORS.PRIMARY_COLOR} />
      </TouchableOpacity>
      {expanded && <Text style={styles.answerText}>{answer}</Text>}
    </View>
  );
};

const HelpSupportScreen = () => {
  const router = useRouter();

  const handleContactEmail = () => {
    Linking.openURL('mailto:elearningapp.support@gmail.com'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Contact Cards */}
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard} onPress={handleContactEmail}>
            <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="mail" size={24} color="#0EA5E9" />
            </View>
            <Text style={styles.contactLabel}>Email Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://wa.me/+2348103784684')}>
            <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="logo-whatsapp" size={24} color="#22C55E" />
            </View>
            <Text style={styles.contactLabel}>WhatsApp</Text>
          </TouchableOpacity>
        </View>

        {/* FAQ Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        <FAQItem 
          question="How do I borrow a book?" 
          answer="Simply navigate to the Library section, click on a book that is 'Available', and tap the 'Borrow' button. It will then appear in your personal collection." 
        />
        <FAQItem 
          question="Is my reading progress saved?" 
          answer="Yes! Your progress is synced to your account via Supabase, so you can continue learning on any device." 
        />
        <FAQItem 
          question="How do I reset my password?" 
          answer="Go to Settings > Privacy & Security > Change Password. You'll need to enter a new 6-digit password." 
        />
        <FAQItem 
          question="Can I read offline?" 
          answer="Currently, an internet connection is required to sync with the library database, but we are working on an offline mode for future updates!" 
        />

        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>App Version 1.0.0</Text>
          <Text style={styles.footerSubtext}>Built with passion by Abdullateef</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  scrollContent: { padding: 20 },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  contactCard: { backgroundColor: '#FFF', width: '48%', padding: 20, borderRadius: 16, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  iconCircle: { padding: 12, borderRadius: 50, marginBottom: 10 },
  contactLabel: { fontWeight: '600', color: '#334155' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15, marginTop: 10 },
  faqContainer: { backgroundColor: '#FFF', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  questionText: { fontSize: 15, fontWeight: '600', color: '#334155', flex: 1, paddingRight: 10 },
  answerText: { padding: 18, paddingTop: 0, fontSize: 14, color: '#64748B', lineHeight: 20 },
  footerInfo: { marginTop: 40, alignItems: 'center' },
  versionText: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  footerSubtext: { color: '#CBD5E1', fontSize: 11, marginTop: 4 }
});

export default HelpSupportScreen;