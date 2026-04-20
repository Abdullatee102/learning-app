import React, { useState, useCallback } from "react";
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  FlatList, Image, Alert, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import SafeView from "../../components/layout/safeView";
import COLORS from "../../constants/colors";
import { supabase } from "../../lib/supabase"; 
import { useAuthStore } from "../../store/authStore";

const BookScreen = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Available"); 
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      if (activeTab === "Available") {
        // Fetch books that have quantity and are not already in user's library
        const { data, error } = await supabase.from('books').select('*').gt('available_qty', 0);
        if (error) throw error;
        setBooks(data);
      } else {
        const { data, error } = await supabase
          .from('user_books')
          .select('*, books(*)')
          .eq('user_id', user.id)
          .eq('status', activeTab)
          .order('updated_at', { ascending: false });
        
        if (error) throw error;
        
        setBooks(data.map(item => ({ 
          ...item.books, 
          id: item.id, 
          real_book_id: item.books.id, 
          user_book_id: item.id, 
          progress: item.progress, 
          status: item.status 
        })));
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchBooks(); }, [activeTab]));

  const handleBorrow = async (book) => {
    try {
      setLoading(true);
      // this Checks if user already has the specific book active
      const { data: existing } = await supabase
        .from('user_books')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', book.id)
        .neq('status', 'Returned'); 

      if (existing?.length > 0) {
        Alert.alert("Notice", "You are already enrolled in this course.");
        setActiveTab("Borrowed");
        return;
      }

      const { error: insertError } = await supabase.from('user_books').insert([{ 
        user_id: user.id, 
        book_id: book.id, 
        status: 'Borrowed', 
        progress: 0 
      }]);

      if (insertError) throw insertError;

      await supabase.from('books').update({ 
        available_qty: Math.max(0, book.available_qty - 1) 
      }).eq('id', book.id);

      Alert.alert("Success!", `You have successfully enrolled in ${book.title}`);
      setActiveTab("Borrowed"); 
    } catch (error) {
      Alert.alert("Error", "Could not enroll at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (item) => {
    Alert.alert("Unenroll", "Are you sure you want to stop learning this language? Your progress will be saved in the 'Returned' tab.", [
      { text: "Cancel", style: "cancel" },
      { text: "Unenroll", style: "destructive", onPress: async () => {
          setLoading(true);
          await supabase.from('user_books').update({ status: 'Returned' }).eq('id', item.user_book_id);
          await supabase.from('books').update({ available_qty: item.available_qty + 1 }).eq('id', item.id);
          fetchBooks();
      }}
    ]);
  };

  const renderBookItem = ({ item }) => {
    const isBorrowed = activeTab === 'Borrowed';
    const isReturned = activeTab === 'Returned';

    return (
      <View style={styles.bookCard}>
        <View style={styles.cardRow}>
          <Image source={{ uri: item.image_url }} style={styles.bookCover} />
          <View style={styles.bookInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.bookTitle} numberOfLines={1}>{item.title}</Text>
              <TouchableOpacity onPress={() => router.push({ 
                pathname: "/(tabs)/message", 
                params: { bookId: item.id, bookTitle: item.title }
              })}>
                <Ionicons name="chatbubbles-outline" size={22} color={COLORS.PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>
            <Text style={styles.bookAuthor}>Language Course</Text>
            
            {(isBorrowed || isReturned) && (
              <View style={styles.progressSection}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${(item.progress || 0) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round((item.progress || 0) * 100)}% Completed</Text>
              </View>
            )}

            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[styles.actionBtn, { flex: 2 }, (isBorrowed || isReturned) ? styles.readBtn : styles.borrowBtn]} 
                onPress={() => (isBorrowed || isReturned) 
                  ? router.push({ pathname: "/reader", params: { bookId: (item.real_book_id || item.id).toString(), title: item.title }}) 
                  : handleBorrow(item)}
              >
                <Text style={styles.actionBtnText}>
                  {(isBorrowed) ? "CONTINUE READING" : isReturned ? "RESUME COURSE" : "ENROLL NOW"}
                </Text>
              </TouchableOpacity>
              
              {isBorrowed && (
                <TouchableOpacity style={[styles.actionBtn, styles.returnBtn]} onPress={() => handleReturn(item)}>
                  <Text style={styles.actionBtnText}>UNENROLL</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Course Library</Text>
        
        <View style={styles.tabContainer}>
          {["Available", "Borrowed", "Returned"].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)} 
              style={[styles.tabPill, activeTab === tab && styles.activeTabPill]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} style={{marginTop: 50}} />
        ) : (
          <FlatList 
            data={books} 
            renderItem={renderBookItem} 
            keyExtractor={(item, index) => `${activeTab}-${item.id || index}`} 
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={50} color="#CCC" />
                <Text style={styles.emptyText}>No courses found in this section.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, marginHorizontal: -10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.PRIMARY_COLOR, textAlign: 'center', marginVertical: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F5F7FA', borderRadius: 15, padding: 5, marginBottom: 20, marginHorizontal: 15 },
  tabPill: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  activeTabPill: { backgroundColor: "#FFF", elevation: 2 },
  tabText: { fontSize: 13, color: "#7F8C8D", fontWeight: '600' },
  activeTabText: { color: COLORS.PRIMARY_COLOR },
  bookCard: { backgroundColor: "#FFF", borderRadius: 20, padding: 15, marginBottom: 15, marginHorizontal: 15, borderWidth: 1, borderColor: "#F0F0F0" },
  cardRow: { flexDirection: 'row', gap: 15 },
  bookCover: { width: 90, height: 120, borderRadius: 12, backgroundColor: '#F0F0F0' },
  bookInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookTitle: { fontSize: 17, fontWeight: 'bold', color: "#2C3E50", flex: 1 },
  bookAuthor: { fontSize: 14, color: "#7F8C8D", marginVertical: 2 },
  progressSection: { marginVertical: 10 },
  progressBarBg: { height: 6, backgroundColor: "#EDF2F7", borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: COLORS.PRIMARY_COLOR, borderRadius: 3 },
  progressText: { fontSize: 11, color: "#94A3B8", marginTop: 4 },
  buttonGroup: { flexDirection: 'row', gap: 8, marginTop: 5 },
  actionBtn: { paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  borrowBtn: { backgroundColor: COLORS.PRIMARY_COLOR },
  readBtn: { backgroundColor: "#1A1A1A" },
  returnBtn: { flex: 1, backgroundColor: "#E74C3C" },
  actionBtnText: { color: "#FFF", fontSize: 10, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 14 }
});

export default BookScreen;