import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import COLORS from '../../constants/colors';
import { router } from 'expo-router';

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const { resetPassword, isLoading } = useAuthStore();

  const handleReset = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    const res = await resetPassword(newPassword);
    if (res.success) {
      router.push("/emailSuccess");
      Alert.alert("Success", "Password updated successfully!");
    } else {
      Alert.alert("Error", res.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        placeholderTextColor="#666"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: COLORS.PRIMARY_COLOR }]} 
        onPress={handleReset}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? "Updating..." : "Update Password"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 15, borderRadius: 10, marginBottom: 20 },
  button: { padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' }
});

export default ResetPasswordScreen;