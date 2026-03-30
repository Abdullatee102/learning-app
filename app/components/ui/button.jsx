import { StyleSheet, Text, TouchableOpacity, ActivityIndicator} from "react-native";

const Button = ({ text, variant = "filled", onPress, style, textStyle, loading= false }) => {
  const isComponent = typeof text !== "string";
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, variant === "outline" && styles.outlineBtn, style]}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[
            styles.btnText,
            variant === "outline" && styles.outlineText,
            textStyle
          ]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#00707E",
    paddingHorizontal: 20,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },

  btnText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },

  outlineBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#00707E",
  },

  outlineText: {
    color: "#00707E",
  },
});
