import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View } from 'react-native';
import { ButtonProvider, useButtonContext } from './ButtonContext';

SplashScreen.preventAutoHideAsync();

function Layout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Stack>
          {/* <Stack.Screen name="CourierTrackingScreen" options={{ headerShown: false }} /> */}
          <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
          <Stack.Screen name="Home" options={{ headerShown: false }} />
          <Stack.Screen name="Enregistrement" options={{ headerShown: false }} />
        </Stack>
      </View>
      {/* <FloatingAddButton /> */}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ButtonProvider>
      <Layout />
    </ButtonProvider>
  );
}