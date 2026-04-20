import React, { useState, useEffect, useRef } from "react";
import { 
  StyleSheet, Text, View, TextInput, 
  FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Alert
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import { useAuthStore } from "../../store/authStore";
import SafeView from "../../components/layout/safeView";
import COLORS from "../../constants/colors";
import {SafeAreaView} from "react-native-safe-area-context";

const MessageScreen = () => {
  const { user } = useAuthStore();
  const { bookId, bookTitle } = useLocalSearchParams();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    if (!bookId) return;

    fetchMessages();

    const channel = supabase
      .channel(`chat:${bookId}`)
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `book_id=eq.${bookId}` },
        (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("book_id", bookId)
      .order("created_at", { ascending: false });

    if (!error) setMessages(data);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    if (!bookId || !user) {
      Alert.alert("Error", "Missing book context or user session.");
      return;
    }

    const newMessage = {
      text: inputText.trim(),
      user_id: user.id,
      user_email: user.email,
      book_id: bookId.toString(),
      created_at: new Date().toISOString(), 
      id: Math.random().toString(), 
    };

    try {
      setMessages((prev) => [newMessage, ...prev]);
      setInputText(""); 

      // THIS SENDS THE DATA TO SUPABASE
      const { error } = await supabase
        .from("messages")
        .insert([{
          text: newMessage.text,
          user_id: newMessage.user_id,
          user_email: newMessage.user_email,
          book_id: newMessage.book_id
        }]);

      if (error) {
        console.error("Supabase Error:", error.message);
        setMessages((prev) => prev.filter(msg => msg.id !== newMessage.id));
        Alert.alert("Send Failed", "Your message couldn't be saved.");
      } else {
        fetchMessages(); 
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.user_id === user.id;
    return (
      <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
        {!isMe && <Text style={styles.senderEmail}>{item.user_email?.split('@')[0]}</Text>}
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Discussion Room</Text>
        <Text style={styles.headerTitle} numberOfLines={1}>{bookTitle || "Select a Book"}</Text>
      </View>

      {!bookId ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={80} color="#DDD" />
          <Text style={styles.emptyText}>Open a book from your library to join the discussion.</Text>
        </View>
      ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            inverted
            contentContainerStyle={styles.listContent}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Share your thoughts..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  header: { padding: 20, backgroundColor: "#FFF", borderBottomWidth: 1, borderBottomColor: "#EEE" },
  headerSubtitle: { fontSize: 12, color: "#AAA", textTransform: 'uppercase' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: "#333" },
  listContent: { paddingHorizontal: 15, paddingVertical: 20 },
  messageWrapper: { marginBottom: 15, maxWidth: '80%' },
  myMessageWrapper: { alignSelf: 'flex-end' },
  theirMessageWrapper: { alignSelf: 'flex-start' },
  senderEmail: { fontSize: 10, color: "#999", marginBottom: 4, marginLeft: 10 },
  bubble: { padding: 12, borderRadius: 18 },
  myBubble: { backgroundColor: COLORS.PRIMARY_COLOR },
  theirBubble: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EEE" },
  messageText: { fontSize: 15 },
  myText: { color: "#FFF" },
  theirText: { color: "#333" },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: "#FFF", borderTopWidth: 1, borderTopColor: "#EEE" },
  input: { flex: 1, backgroundColor: "#F0F2F5", borderRadius: 25, paddingHorizontal: 15, paddingVertical: 8, marginRight: 10 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#AAA', marginTop: 10 }
});

export default MessageScreen;