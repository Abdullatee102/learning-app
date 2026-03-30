import { useEffect, useRef, useState } from "react";
import { Text, Animated } from "react-native";

const PasswordValidation = ({ password }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(true);

  // List of rules to check
  const rules = [
    { label: "At least 8 characters", test: (pw) => pw.length >= 8 },
    { label: "At least one uppercase letter", test: (pw) => /[A-Z]/.test(pw) },
    { label: "At least one lowercase letter", test: (pw) => /[a-z]/.test(pw) },
    {
      label: "At least one special character",
      test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    },
  ];

  // Check if all rules pass
  const isPasswordValid = rules.every((rule) => rule.test(password));

  // Handle fade-in/out
  useEffect(() => {
    if (!password) {
      fadeAnim.setValue(0);
      setVisible(true);
      return;
    }

    if (isPasswordValid) {
      // Fade out after 1s
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setVisible(true); // show if invalid
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [password, isPasswordValid]);

  if (!visible) return null;

  // If user hasn’t typed yet, show default hint
  if (!password) {
    return (
      <Text
        style={{
          color: "#334155",
          fontSize: 14,
          fontFamily: "Montserrat-Italic",
        }}
      >
        Must contain at least 8 characters
      </Text>
    );
  }

  // Otherwise, show live checklist
  return (
    <Animated.View style={{ opacity: fadeAnim, marginTop: 4 }}>
      {rules.map((rule, index) => (
        <Text
          key={index}
          style={{
            color: rule.test(password) ? "blue" : "#FF6666",
            fontSize: 14,
            fontFamily: "Montserrat-Italic",
          }}
        >
          {rule.test(password) ? "✅" : "❌"} {rule.label}
        </Text>
      ))}
    </Animated.View>
  );
};

export default PasswordValidation;
