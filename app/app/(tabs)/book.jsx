import React, { useState, useEffect, useCallback } from "react";
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
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .gt('available_qty', 0);
        
        if (error) throw error;
        setBooks(data);
      } else {
        const { data, error } = await supabase
          .from('user_books')
          .select('*, books(*)')
          .eq('user_id', user.id)
          .eq('status', activeTab);

        if (error) throw error;

        const formatted = data.map(item => ({
          ...item.books,
          user_book_id: item.id,
          progress: item.progress,
          status: item.status
        }));
        setBooks(formatted);
      }
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
    }, [activeTab])
  );

  const handleBorrow = async (book) => {
    try {
      setLoading(true);
      const { data: existing } = await supabase
        .from('user_books')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', book.id)
        .eq('status', 'Borrowed');

      if (existing && existing.length > 0) {
        Alert.alert("Notice", "You already have this book in your library.");
        setActiveTab("Borrowed");
        return;
      }

      const { error: borrowError } = await supabase
        .from('user_books')
        .insert([{ 
          user_id: user.id, 
          book_id: book.id, 
          status: 'Borrowed', 
          progress: 0 
        }]);

      if (borrowError) throw borrowError;

      const { error: stockError } = await supabase
        .from('books')
        .update({ available_qty: book.available_qty - 1 })
        .eq('id', book.id);

      if (stockError) throw stockError;

      Alert.alert("Success!", `You have borrowed ${book.title}`);
      setActiveTab("Borrowed"); 
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (item) => {
    Alert.alert(
      "Return Book",
      "Are you sure you want to return this book?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Return", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const { error: returnError } = await supabase
                .from('user_books')
                .update({ status: 'Returned' })
                .eq('id', item.user_book_id);

              if (returnError) throw returnError;

              const { error: stockError } = await supabase
                .from('books')
                .update({ available_qty: item.available_qty + 1 })
                .eq('id', item.id);

              if (stockError) throw stockError;

              Alert.alert("Success", "Book returned to library.");
              fetchBooks();
            } catch (error) {
              Alert.alert("Error", error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // --- NEW EMPTY STATE COMPONENT ---
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={80} color="#E0E0E0" />
      <Text style={styles.emptyTitle}>No books found</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "Available" 
          ? "The library is empty right now." 
          : `You haven't ${activeTab.toLowerCase()} any books yet.`}
      </Text>
      {activeTab !== "Available" && (
        <TouchableOpacity 
          style={styles.exploreBtn} 
          onPress={() => setActiveTab("Available")}
        >
          <Text style={styles.exploreBtnText}>Explore Library</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
                <Ionicons name="chatbubbles-outline" size={20} color={COLORS.PRIMARY_COLOR} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.bookAuthor}>by {item.author}</Text>
            
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
            </View>

            {(isBorrowed || isReturned) && (
              <View style={styles.progressSection}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${(item.progress || 0) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round((item.progress || 0) * 100)}% read</Text>
              </View>
            )}

            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={[
                  styles.actionBtn, 
                  { flex: 2 },
                  isBorrowed ? styles.readBtn : isReturned ? styles.readBtn : styles.borrowBtn
                ]} 
                onPress={() => {
                  if (isBorrowed || isReturned) {
                    router.push({
                      pathname: "/reader",
                      params: { bookId: item.id.toString(), title: item.title }
                    });
                  } else {
                    handleBorrow(item);
                  }
                }}
              >
                <Text style={styles.actionBtnText}>
                  {isBorrowed ? "CONTINUE" : isReturned ? "RE-READ" : "BORROW NOW"}
                </Text>
              </TouchableOpacity>

              {isBorrowed && (
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.returnBtn]} 
                  onPress={() => handleReturn(item)}
                >
                  <Text style={styles.actionBtnText}>RETURN</Text>
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Library</Text>
        </View>

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
          <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => activeTab === 'Available' ? `avail-${item.id}` : `ub-${item.user_book_id || Math.random()}` }
            renderItem={renderBookItem}
            contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
            ListEmptyComponent={<EmptyState />} 
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  container: { flex: 1, marginHorizontal: -10 },
  header: { marginTop: 10, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.PRIMARY_COLOR, textAlign: 'center' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F5F7FA', borderRadius: 15, padding: 5, marginBottom: 20, marginHorizontal: 15 },
  tabPill: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  activeTabPill: { backgroundColor: "#FFF", elevation: 2 },
  tabText: { fontSize: 13, color: "#7F8C8D", fontWeight: '600' },
  activeTabText: { color: COLORS.PRIMARY_COLOR },
  bookCard: { backgroundColor: "#FFF", borderRadius: 20, padding: 15, marginBottom: 15, marginHorizontal: 15, borderWidth: 1, borderColor: "#F0F0F0" },
  cardRow: { flexDirection: 'row', gap: 15 },
  bookCover: { width: 90, height: 130, borderRadius: 12, backgroundColor: '#F0F0F0' },
  bookInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookTitle: { fontSize: 17, fontWeight: 'bold', color: "#2C3E50", flex: 1 },
  bookAuthor: { fontSize: 14, color: "#7F8C8D" },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  ratingText: { fontSize: 13, color: "#34495E" },
  progressSection: { marginBottom: 12 },
  progressBarBg: { height: 6, backgroundColor: "#EDF2F7", borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: COLORS.PRIMARY_COLOR, borderRadius: 3 },
  progressText: { fontSize: 11, color: "#94A3B8", marginTop: 4 },
  
  buttonGroup: { flexDirection: 'row', gap: 8, marginTop: 5 },
  actionBtn: { paddingVertical: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  borrowBtn: { backgroundColor: COLORS.PRIMARY_COLOR },
  readBtn: { backgroundColor: "#1A1A1A" },
  returnBtn: { flex: 1, backgroundColor: "#E74C3C" },
  actionBtnText: { color: "#FFF", fontSize: 11, fontWeight: 'bold' },

  // --- STYLES FOR EMPTY STATE ---
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#2C3E50', marginTop: 15 },
  emptySubtitle: { fontSize: 14, color: '#7F8C8D', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  exploreBtn: { marginTop: 20, backgroundColor: COLORS.PRIMARY_COLOR, paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  exploreBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 }
});

export default BookScreen;