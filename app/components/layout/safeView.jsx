import { useWindowDimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SafeView = ({ children, bgColor }) => {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingHorizontal: width * 0.05,
          backgroundColor: bgColor ? bgColor : "#FFF",
        },
      ]}
      edges={["top"]}
    >
      {children}
    </SafeAreaView>
  );
};

export default SafeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
