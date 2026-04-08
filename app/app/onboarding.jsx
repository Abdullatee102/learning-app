import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  StyleSheet, 
  Dimensions, 
  Pressable 
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { pages } from '../data/onboarding';
import Button from '../components/ui/button';
import COLORS from "../constants/colors";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setHasFinishedOnboarding } = useAuthStore();

  const handleNext = () => {
    if (currentIndex < pages.length - 1) {
      flatListRef.current.scrollToIndex({ 
        index: currentIndex + 1,
        animated: true 
      });
    } else {
      router.replace("/onboarding2");
    }
  };

  const handleSkip = () => {
    flatListRef.current.scrollToIndex({ 
      index: pages.length - 1,
      animated: true 
    });
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.skipContainer}>
        {currentIndex < pages.length - 1 && (
          <Pressable onPress={handleSkip} hitSlop={20}>
            <Text style={styles.skipText}>SKIP</Text>
          </Pressable>
        )}
      </View>

      <Image source={item.image} style={styles.image} resizeMode="contain" />

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.subtitle}</Text>

        <View style={styles.pagination}>
          {pages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <Button
          text={currentIndex === pages.length - 1 ? "GET STARTED" : "NEXT"}
          onPress={handleNext}
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  slide: { flex: 1, paddingHorizontal: 20, justifyContent: 'center', marginTop: 40 },
  skipContainer: { height: 40, alignItems: 'flex-end', justifyContent: 'center', marginTop: 10 },
  skipText: { fontFamily: 'Roboto-Regular', fontSize: 16, color: COLORS.PRIMARY_COLOR },
  image: { width: '100%', height: width * 0.8, marginVertical: 20 },
  content: { alignItems: 'center', flex: 1 },
  title: { fontFamily: 'Roboto-Bold', fontSize: 28, textAlign: 'center', color: '#1A1A1A', marginBottom: 12 },
  description: { fontFamily: 'Roboto-Regular', fontSize: 16, textAlign: 'center', color: '#666666', lineHeight: 22, paddingHorizontal: 15, marginBottom: 30 },
  pagination: { flexDirection: 'row', height: 8, marginBottom: 40, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
  inactiveDot: { width: 8, backgroundColor: '#E0E0E0' },
  activeDot: { width: 24, backgroundColor: COLORS.PRIMARY_COLOR },
  actionButton: { width: '85%', height: 54, borderRadius: 12 },
});