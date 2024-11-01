import React, { useState, useCallback, useEffect } from 'react';
import { Asset } from 'expo-asset';
import * as SplashScreen from 'expo-splash-screen';
import AnimatedSplashScreen from './AnimatedSplashScreen';
import LoginScreen from './LoginScreen';

// Empêcher le splash screen natif de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

export default function Page() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Préchargement des ressources
  const prepareResources = async () => {
    try {
      // Précharger toutes vos images
      await Promise.all([
        Asset.loadAsync([
          require('../assets/images/splash.png'),
          require('../assets/images/aic.png'),
        ]),
      ]);
    } catch (error) {
      console.warn('Erreur lors du chargement des ressources:', error);
    } finally {
      setIsReady(true);
      // Cacher le splash screen natif une fois que les ressources sont chargées
      await SplashScreen.hideAsync();
    }
  };

  // Charger les ressources au montage du composant
  useEffect(() => {
    prepareResources();
  }, []);

  // Gérer la fin de l'animations
  const handleAnimationComplete = useCallback(() => {
    setIsSplashComplete(true);
  }, []);

  // Ne rien afficher tant que les ressources ne sont pas chargées
  if (!isReady) {
    return null;
  }

  return (
    <>
      {!isSplashComplete ? (
        <AnimatedSplashScreen onAnimationComplete={handleAnimationComplete} />
      ) : (
        <LoginScreen />
      )}
    </>
  );
}