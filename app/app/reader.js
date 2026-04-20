import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";
import COLORS from "../constants/colors";
import { BOOK_CONTENTS } from "../data/books";

const { height: WINDOW_HEIGHT } = Dimensions.get("window");

const ReaderScreen = () => {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const { user } = useAuthStore();
  const { bookId, title } = useLocalSearchParams();
  
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [initialFetchedProgress, setInitialFetchedProgress] = useState(0);

  useEffect(() => {
    const loadLessonData = async () => {
      setLoading(true);
      const bookData = BOOK_CONTENTS[bookId];
      if (bookData) {
        setContent(bookData.map(item => item.text).join("\n\n---\n\n"));
      }

      try {
        const { data } = await supabase
          .from('user_books')
          .select('progress')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .single();
        
        if (data) {
          setInitialFetchedProgress(data.progress || 0);
          setProgress(data.progress || 0);
        }
      } catch (e) { console.log("Progress fetch error", e); }
      
      setLoading(false);
    };

    loadLessonData();
  }, [bookId]);

  const handleInitialScroll = (event) => {
    if (initialFetchedProgress > 0 && scrollViewRef.current) {
      const contentHeight = event.nativeEvent.contentSize.height;
      const scrollTo = initialFetchedProgress * (contentHeight - WINDOW_HEIGHT);
      scrollViewRef.current.scrollTo({ y: scrollTo, animated: false });
      setInitialFetchedProgress(0);
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollableHeight = contentSize.height - layoutMeasurement.height;
    if (scrollableHeight > 0) {
      const currentProgress = Math.max(0, Math.min(1, contentOffset.y / scrollableHeight));
      setProgress(currentProgress);
    }
  };

  const saveAndExit = async () => {
    try {
      await supabase
        .from('user_books')
        .update({ progress: progress, updated_at: new Date() })
        .eq('user_id', user.id)
        .eq('book_id', bookId);
      
      router.back();
    } catch (e) { 
      router.back(); 
    }
  };

  if (loading) return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={saveAndExit}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.bookTitle} numberOfLines={1}>{title}</Text>
          <Text style={styles.progressLabel}>{Math.round(progress * 100)}% Mastered</Text>
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
        ref={scrollViewRef}
        onScroll={handleScroll} 
        onContentSizeChange={(w, h) => handleInitialScroll({ nativeEvent: { contentSize: { height: h } } })}
        scrollEventThrottle={16} 
        contentContainerStyle={styles.readArea}
      >
        <Text style={styles.contentText}>{content}</Text>

        <View style={styles.endOfBook}>
          {progress > 0.95 && (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
              <Text style={styles.endTitle}>You've completed this lesson!</Text>
              <TouchableOpacity style={styles.finishBtn} onPress={saveAndExit}>
                <Text style={styles.finishBtnText}>Finish Lesson</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBF5" },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  headerCenter: { alignItems: 'center', flex: 1, paddingHorizontal: 10 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  progressLabel: { fontSize: 11, color: COLORS.PRIMARY_COLOR, fontWeight: '600', marginTop: 2 },
  topProgressBarBg: { height: 4, backgroundColor: '#EAEAEA' },
  topProgressBarFill: { height: 4, backgroundColor: COLORS.PRIMARY_COLOR },
  readArea: { padding: 25, paddingBottom: 100 },
  contentText: { 
    fontSize: 19, 
    lineHeight: 34, 
    color: '#2C3E50', 
    textAlign: 'left'
  },
  endOfBook: { marginTop: 60, height: 200, alignItems: 'center' },
  endTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginTop: 20 },
  finishBtn: { 
    marginTop: 25, 
    backgroundColor: COLORS.PRIMARY_COLOR, 
    paddingHorizontal: 40, 
    paddingVertical: 15, 
    borderRadius: 30 
  },
  finishBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default ReaderScreen;