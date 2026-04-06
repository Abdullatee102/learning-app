import React from "react";
import { ActivityIndicator, StyleSheet, View, Modal, Text } from "react-native";
import COLORS from "../../constants/colors";

const Load = ({ visible, title = "Verifying..." }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}} // Prevents back button on Android from closing it
    >
      <View style={styles.container}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY_COLOR} />
          {title && <Text style={styles.text}>{title}</Text>}
        </View>
      </View>
    </Modal>
  );
};

export default Load;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dim the background
  },
  overlay: {
    width: 150,
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    // Professional shadow
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    marginTop: 15,
    fontSize: 14,
    fontFamily: "Roboto-Medium",
    color: "#333",
  },
});