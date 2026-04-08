import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatIcon } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "../../constants/colors";

const ProgressCard = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const ActiveBookItem = ({ title, author, progress }) => (
  <View style={styles.bookItem}>
    <View style={styles.bookInfo}>
      <Text style={styles.bookTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.bookAuthor}>{author}</Text>
    </View>
    <View style={styles.progressWrapper}>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressPercentage}>{progress}%</Text>
    </View>
  </View>
);

const LearningProgressScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Learning Progress</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <ProgressCard title="Books Read" value="3" icon="book" color="#0EA5E9" />
          <ProgressCard title="Hours Spent" value="16h" icon="time" color="#F59E0B" />
          <ProgressCard title="Current Streak" value="7 Days" icon="flame" color="#EF4444" />
          <ProgressCard title="Completed" value="85%" icon="checkmark-circle" color="#10B981" />
        </View>

        {/* Currently Reading Section */}
        <Text style={styles.sectionTitle}>Currently Reading</Text>
        
        <ActiveBookItem 
          title="HTML" 
          author="Tim Berners-Lee" 
          progress={65} 
        />
        <ActiveBookItem 
          title="CSS" 
          author="Hakon Wium Lie" 
          progress={30} 
        />
        <ActiveBookItem 
          title="JAVASCRIPT" 
          author="Breidan Eich" 
          progress={90} 
        />

        {/* Quick Action Button */}
        <TouchableOpacity 
          style={styles.continueBtn}
          onPress={() => router.push('/book')}
        >
          <Text style={styles.continueBtnText}>Continue Learning</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  scroll: { padding: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: '#FFF', width: '48%', padding: 15, borderRadius: 16, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  statTitle: { fontSize: 12, color: '#64748B', marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 15 },
  bookItem: { backgroundColor: '#FFF', padding: 15, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  bookTitle: { fontSize: 15, fontWeight: '600', color: '#334155' },
  bookAuthor: { fontSize: 13, color: '#94A3B8', marginBottom: 12 },
  progressWrapper: { flexDirection: 'row', alignItems: 'center' },
  progressBarBg: { flex: 1, height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, marginRight: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.PRIMARY_COLOR, borderRadius: 4 },
  progressPercentage: { fontSize: 12, fontWeight: 'bold', color: COLORS.PRIMARY_COLOR, width: 35 },
  continueBtn: { backgroundColor: COLORS.PRIMARY_COLOR, flexDirection: 'row', padding: 18, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  continueBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginRight: 8 }
});

export default LearningProgressScreen;