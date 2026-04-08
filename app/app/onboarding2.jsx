import React from "react";
import { 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import COLORS from "../constants/colors";

const { width } = Dimensions.get("window");

const Onboarding2 = () => {
  const { setHasFinishedOnboarding } = useAuthStore();

  const handleEntry = (path) => {
    setHasFinishedOnboarding(true);
    router.replace(path);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.imageBox}>
          <Image 
            source={require('../assets/images/learning.png')} 
            style={styles.heroImage} 
            resizeMode="contain" 
          />
        </View>

        <View style={styles.textBox}>
          <Text style={styles.headline}>Unlock Your Learning Potential</Text>
          <Text style={styles.subHeadline}>
            Your gateway to personalized courses, and guidance for success.
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            onPress={() => handleEntry('/signIn')} 
            style={styles.primaryBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>SIGN IN</Text> 
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handleEntry('/signUp')} 
            style={styles.secondaryBtn}
            activeOpacity={0.7}
          > 
            <Text style={styles.secondaryBtnText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default Onboarding2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  imageBox: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: width * 0.9,
    height: '100%',
  },
  textBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headline: {
    fontFamily: 'Roboto-Bold',
    fontSize: 26,
    color: COLORS.PRIMARY_COLOR || '#00707E',
    textAlign: 'center',
    marginBottom: 16,
  },
  subHeadline: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: 15,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_COLOR || '#00707E',
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryBtnText: {
    fontFamily: 'Roboto-Bold',
    color: '#FFF',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#FFF',
    height: 56,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.PRIMARY_COLOR || '#00707E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Roboto-Bold',
    color: COLORS.PRIMARY_COLOR || '#00707E',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});