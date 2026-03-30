import { ActivityIndicator, StyleSheet, View } from "react-native";
import COLORS from "../../constants/colors";

const Load = ({ size = "large", color = COLORS.PRIMARY_COLOR }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Load;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
