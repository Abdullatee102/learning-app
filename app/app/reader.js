import React, { useState, useEffect, useRef } from "react";
import { 
  StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, ActivityIndicator 
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import COLORS from "../constants/colors";
import { BOOK_CONTENTS } from "../data/books";

const ReaderScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const { bookId, title } = useLocalSearchParams();
  
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadBookData = async () => {
      if (!bookId) return;

      try {
        setLoading(true);

        const { data: userData } = await supabase
          .from('user_books')
          .select('progress')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .order('created_at', { ascending: false })
          .limit(1); //this is used to avoid borrowing a book twice

        if (userData && userData.length > 0) {
          setProgress(userData[0].progress);
        }

        // 2. Process Content
        const bookData = BOOK_CONTENTS ? BOOK_CONTENTS[bookId] : null;

        if (bookData && Array.isArray(bookData)) {
          const fullText = bookData.map(item => item.text).join("\n\n---\n\n");
          setContent(fullText);
        } else if (typeof bookData === 'string') {
          setContent(bookData);
        } else {
          const { data: bookMeta } = await supabase
            .from('books')
            .select('description')
            .eq('id', bookId)
            .single();
          
          setContent(bookMeta?.description || "Content is currently unavailable.");
        }
        
      } catch (error) {
        console.error("Reader Load Error:", error);
        setContent("Error loading content.");
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [bookId]);

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollableHeight = contentSize.height - layoutMeasurement.height;
    
    if (scrollableHeight > 0) {
      const currentProgress = contentOffset.y / scrollableHeight;
      setProgress(Math.max(0, Math.min(1, currentProgress)));
    }
  };

  const saveAndExit = async () => {
    try {
      await supabase
        .from('user_books')
        .update({ progress: progress })
        .eq('user_id', user.id)
        .eq('book_id', bookId);
        
      router.back();
    } catch (error) {
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Opening {title}...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={saveAndExit}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.bookTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.progressLabel}>{Math.round(progress * 100)}% read</Text>
        </View>
        <TouchableOpacity onPress={() => router.push({
          pathname: "/(tabs)/message",
          params: { bookId, bookTitle: title }
        })}>
          <Ionicons name="chatbubbles-outline" size={24} color={COLORS.PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      <View style={styles.topProgressBarBg}>
        <View style={[styles.topProgressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView 
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.readArea}
      >
        <Text style={styles.contentText}>{content}</Text>
        <View style={styles.endOfBook}>
          <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
          <Text style={styles.endTitle}>You've finished the preview!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBF5" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#888' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', backgroundColor: '#FFF' },
  headerCenter: { alignItems: 'center', flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold' },
  progressLabel: { fontSize: 11, color: COLORS.PRIMARY_COLOR },
  topProgressBarBg: { height: 4, backgroundColor: '#EAEAEA' },
  topProgressBarFill: { height: 4, backgroundColor: COLORS.PRIMARY_COLOR },
  readArea: { padding: 25, paddingBottom: 100 },
  contentText: { fontSize: 19, lineHeight: 32, color: '#2C3E50', textAlign: 'justify' },
  endOfBook: { marginTop: 60, alignItems: 'center' },
  endTitle: { fontSize: 16, color: '#444', marginTop: 20 }
});

export default ReaderScreen;