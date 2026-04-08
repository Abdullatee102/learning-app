import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import COLORS from "../../constants/colors";
import { getDayTime } from "../../lib/greeting";

const { width } = Dimensions.get("window");

const CAT_PILLS = ["HTML", "CSS", "JavaScript", "React", "Python", "Node.js"];

const PROGRESS_DATA = [
  { id: '1', title: 'Web Development Basics', progress: 0.75, school: 'E-learning Academy', image: 'https://img.icons8.com/color/480/html-5--v1.png' },
  { id: '2', title: 'React Native Pro', progress: 0.35, school: 'E-learning Academy', image: 'https://img.icons8.com/nolan/480/react-native.png' }, 
  { id: '3', title: 'Git Mastery', progress: 0.5, school: 'E-learning Academy', image: 'https://img.icons8.com/color/480/git.png' }, 
];

const SUGGESTIONS_DATA = [
  { id: '1', title: 'TypeScript Master', instructor: 'Dev Academy', rating: '4.8', image: 'https://img.icons8.com/color/480/typescript.png' },
  { id: '2', title: 'Node.js Backend', instructor: 'JS Institute', rating: '4.9', image: 'https://img.icons8.com/color/480/nodejs.png' },
  { id: '3', title: 'SQL Databases', instructor: 'Data Query Pro', rating: '4.7', image: 'https://img.icons8.com/color/480/postgreesql.png' },
  { id: '4', title: 'Python for AI', instructor: 'PyCoach', rating: '4.9', image: 'https://img.icons8.com/color/480/python--v1.png' },
  { id: '5', title: 'Java Enterprise', instructor: 'Oracle Prep', rating: '4.6', image: 'https://img.icons8.com/color/480/java-coffee-cup-logo--v1.png' },
  { id: '6', title: 'MongoDB NoSQL', instructor: 'Cloud Atlas', rating: '4.8', image: 'https://img.icons8.com/color/480/mongodb.png' },
];

const HomeScreen = () => {
  const { user } = useAuthStore();
  const [greeting, setGreeting] = useState(getDayTime());

  useEffect(() => {
    const timer = setInterval(() => setGreeting(getDayTime()), 60000);
    return () => clearInterval(timer);
  }, []);

  const firstName = user?.user_metadata?.last_name || user?.user_metadata?.full_name?.split(" ")[0] || "User";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{greeting}, <Text style={styles.userName}>{firstName} 👋</Text></Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color={COLORS.PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput placeholder="Search modules..." style={styles.searchInput} placeholderTextColor="#999" />
        </View>

        {/* CONTINUE LEARNING */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Learning</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {PROGRESS_DATA.map((item) => (
            <View key={item.id} style={styles.progressCard}>
              <View style={styles.cardContent}>
                <View style={styles.placeholderImg}> 
                   <Image source={{ uri: item.image }} style={styles.fullImage} resizeMode="contain" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSub}>{item.school}</Text>
                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{Math.round(item.progress * 100)}% Completed</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* CATEGORIES */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
        </View>
        <FlatList
          data={CAT_PILLS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pill}>
              <Text style={styles.pillText}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        {/* SUGGESTIONS FOR YOU */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Suggestions for You</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
        </View>
        
        <View style={styles.gridContainer}>
          {SUGGESTIONS_DATA.map((item) => (
            <SuggestionCard 
              key={item.id}
              title={item.title} 
              instructor={item.instructor} 
              rating={item.rating} 
              image={item.image}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const SuggestionCard = ({ title, instructor, rating, image }) => (
  <View style={styles.gridCard}>
    <View style={styles.gridImgPlaceholder}>
        <Image source={{ uri: image }} style={styles.fullImage} resizeMode="contain" />
    </View>
    <Text style={styles.gridTitle} numberOfLines={1}>{title}</Text>
    <Text style={styles.gridSub}>{instructor}</Text>
    <View style={styles.ratingRow}>
      <Ionicons name="star" size={12} color="#FFD700" />
      <Text style={styles.ratingText}>{rating}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  greetingText: { fontSize: 14, color: "#888", fontWeight: 'bold' },
  userName: { fontWeight: "bold", color: COLORS.PRIMARY_COLOR },
  
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: "#F5F5F5", 
    marginHorizontal: 20, 
    paddingHorizontal: 15, 
    borderRadius: 25,
    height: 50,
    marginBottom: 20
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 25, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: "#004D40" },
  seeAllText: { color: "#999", fontSize: 14 },

  horizontalScroll: { paddingLeft: 20 },
  progressCard: { 
    width: width * 0.8, 
    backgroundColor: "#FFF", 
    borderRadius: 15, 
    marginRight: 15, 
    padding: 15,
    borderWidth: 1,
    borderColor: "#EEE"
  },
  cardContent: { flexDirection: 'row', gap: 15 },
  placeholderImg: { width: 80, height: 80, backgroundColor: "#E0F2F1", borderRadius: 10, overflow: 'hidden' },
  fullImage: { flex: 1, width: '100%', height: '100%' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: "#333" },
  cardSub: { fontSize: 12, color: "#666", marginBottom: 10 },
  progressBg: { height: 6, backgroundColor: "#EEE", borderRadius: 3, marginBottom: 5 },
  progressFill: { height: 6, backgroundColor: COLORS.PRIMARY_COLOR, borderRadius: 3 },
  progressText: { fontSize: 10, color: "#999", textAlign: 'right' },

  pill: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.PRIMARY_COLOR, 
    marginRight: 10 
  },
  pillText: { color: COLORS.PRIMARY_COLOR, fontSize: 14, fontWeight: "500" },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20 
  },
  gridCard: { 
    width: '47%', 
    marginBottom: 20
  },
  gridImgPlaceholder: { width: '100%', height: 110, backgroundColor: "#F0F0F0", borderRadius: 12, marginBottom: 10, overflow: 'hidden', padding: 10 },
  gridTitle: { fontSize: 14, fontWeight: 'bold', color: "#333" },
  gridSub: { fontSize: 11, color: "#999", marginVertical: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 11, color: "#333" }
});

export default HomeScreen;