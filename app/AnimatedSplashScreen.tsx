import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ActivityIndicator, Image } from 'react-native';

const AnimatedSplashScreen = ({ onAnimationComplete }) => {
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Démarrer les animations immédiatement
    Animated.parallel([
      // Animation du logo
      Animated.sequence([
        // Faire apparaître le logo
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        // Animation de zoom
        Animated.timing(logoScale, {
          toValue: 2.2,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // Animation du loading
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(loadingAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Déclencher la transition après un délai
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, 3000); // Ajustez ce délai selon vos besoins

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Image de fond */}
      <Image
        source={require('../assets/images/splash.png')}
        style={styles.backgroundImage}
      />

      {/* Logo avec animation */}
      <Animated.Image
        source={require('../assets/images/aic.png')}
        style={[
          styles.logo,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Indicateur de chargement */}
      <Animated.View style={[styles.loadingContainer, { opacity: loadingAnim }]}>
        <ActivityIndicator size="large" color="#0037B2" />
      </Animated.View>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    resizeMode: 'cover',
  },
  logo: {
    width: windowWidth * 0.5,
    height: windowWidth * 0.5,
    position: 'absolute',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 50,
  },
});

export default AnimatedSplashScreen;