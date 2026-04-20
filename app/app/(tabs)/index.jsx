import React, { useState, useEffect, useCallback } from "react";
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  FlatList, ScrollView, Image, TextInput, Dimensions, ActivityIndicator, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { supabase } from "../../lib/supabase";
import COLORS from "../../constants/colors";
import { getDayTime } from "../../lib/greeting";

const { width } = Dimensions.get("window");

const CAT_PILLS = ["Vocabulary", "Grammar", "Phrases", "Listening", "Pronunciation", "Quizzes"];

const SUGGESTIONS_DATA = [
  { id: '1', title: 'German A1', instructor: 'Hans Schmidt', rating: '4.8', image: 'https://flagcdn.com/w320/de.png' },
  { id: '2', title: 'Japanese N5', instructor: 'Sato Sensei', rating: '4.9', image: 'https://flagcdn.com/w320/jp.png' },
  { id: '3', title: 'Italian Pro', instructor: 'Chef Mario', rating: '4.7', image: 'https://flagcdn.com/w320/it.png' },
  { id: '4', title: 'Arabic Basics', instructor: 'Zaid Ali', rating: '4.6', image: 'https://flagcdn.com/w320/sa.png' },
  { id: '5', title: 'Brazilian Port.', instructor: 'Ana Silva', rating: '4.5', image: 'https://flagcdn.com/w320/br.png' },
  { id: '6', title: 'Russian Vocab', instructor: 'Dr. Ivanov', rating: '4.7', image: 'https://flagcdn.com/w320/ru.png' },
];

const HomeScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState(getDayTime());
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_books')
        .select('*, books(*)')
        .eq('user_id', user.id)
        .eq('status', 'Borrowed')
        .order('updated_at', { ascending: false }) 
        .limit(3); 
      
      if (!error) setUserProgress(data);
    } catch (e) { 
      console.log("Error fetching progress:", e); 
    } finally { 
      setLoading(false); 
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMyProgress();
    }, [])
  );

  useEffect(() => {
    const timer = setInterval(() => setGreeting(getDayTime()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleUnavailablePress = () => {
    Alert.alert(
      "Course Unavailable",
      "These suggested courses aren't currently available for enrollment. Please check the 'Available' section in your Book Library to see what's ready for you!",
      [{ text: "Go to Library", onPress: () => router.push("/(tabs)/book") }, { text: "OK", style: "cancel" }]
    );
  };

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "Learner";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{greeting}, <Text style={styles.userName}>{firstName} 👋</Text></Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications" size={26} color={COLORS.PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>

        {/* Search Section */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput placeholder="Search languages..." style={styles.searchInput} placeholderTextColor="#999" />
        </View>

        {/* Progress Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {loading ? (
            <ActivityIndicator color={COLORS.PRIMARY_COLOR} style={{ marginLeft: 20 }} />
          ) : userProgress.length > 0 ? (
            userProgress.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.progressCard}
                onPress={() => router.push({ 
                  pathname: "/reader", 
                  params: { bookId: item.books.id, title: item.books.title }
                })}
              >
                <View style={styles.cardContent}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: item.books.image_url }} style={styles.fullImage} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.books.title}</Text>
                    <Text style={styles.cardSub}>Continue Learning</Text>
                    <View style={styles.progressBg}>
                      <View style={[styles.progressFill, { width: `${(item.progress || 0) * 100}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{Math.round((item.progress || 0) * 100)}% Complete</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <TouchableOpacity style={styles.emptyProgressCard} onPress={() => router.push("/(tabs)/book")}>
               <Ionicons name="add-circle-outline" size={24} color={COLORS.PRIMARY_COLOR} />
               <Text style={styles.cardSub}>Enroll in a course to track progress</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <FlatList
          data={CAT_PILLS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pill} onPress={() => router.push("/(tabs)/book")}>
              <Text style={styles.pillText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggested for You</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/book")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.gridContainer}>
          {SUGGESTIONS_DATA.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.gridCard} 
              onPress={handleUnavailablePress}
            >
              <View style={styles.gridImgPlaceholder}>
                  <Image source={{ uri: item.image }} style={styles.fullImage} />
              </View>
              <Text style={styles.gridTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.gridSub}>{item.instructor}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  greetingText: { fontSize: 14, color: "#888", fontWeight: 'bold' },
  userName: { fontWeight: "bold", color: COLORS.PRIMARY_COLOR },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#F5F5F5", marginHorizontal: 20, paddingHorizontal: 15, borderRadius: 25, height: 50, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#000' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: "#004D40" },
  seeAllText: { color: "#999", fontSize: 14 },
  horizontalScroll: { paddingLeft: 20 },
  progressCard: { width: width * 0.75, backgroundColor: "#FFF", borderRadius: 15, marginRight: 15, padding: 15, borderWidth: 1, borderColor: "#EEE", elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  emptyProgressCard: { width: width * 0.75, height: 100, backgroundColor: "#F9F9F9", borderRadius: 15, marginRight: 15, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD' },
  cardContent: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  imageWrapper: { width: 60, height: 60, borderRadius: 10, backgroundColor: '#F0F0F0', overflow: 'hidden' },
  fullImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: "#333" },
  cardSub: { fontSize: 12, color: "#666", marginBottom: 8 },
  progressBg: { height: 6, backgroundColor: "#EEE", borderRadius: 3, marginBottom: 5 },
  progressFill: { height: 6, backgroundColor: COLORS.PRIMARY_COLOR, borderRadius: 3 },
  progressText: { fontSize: 10, color: "#999", textAlign: 'right' },
  pill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: COLORS.PRIMARY_COLOR, marginRight: 10 },
  pillText: { color: COLORS.PRIMARY_COLOR, fontSize: 14, fontWeight: "500" },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  gridCard: { width: '47%', marginBottom: 20 },
  gridImgPlaceholder: { width: '100%', height: 110, backgroundColor: "#F0F0F0", borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
  gridTitle: { fontSize: 14, fontWeight: 'bold', color: "#333" },
  gridSub: { fontSize: 11, color: "#999", marginVertical: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 11, color: "#333" }
});

export default HomeScreen;