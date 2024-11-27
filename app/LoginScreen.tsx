import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Platform, SafeAreaView, KeyboardAvoidingView, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for persistent storage
import { COLORS } from '@/constants/theme'; 
import { router, Stack } from 'expo-router';
import { useButtonContext } from './ButtonContext';
import { Ionicons } from '@expo/vector-icons';


export default function LoginScreen() {
  const { setShowButton } = useButtonContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for managing authentication

  useEffect(() => {
    setShowButton(false);

    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          setIsAuthenticated(true); // The user is authenticated
          router.push('/Home'); // Redirect to another page
        }
      } catch (error) {
        console.error('Error fetching token from storage', error);
      }
    };

    checkAuthStatus();

    // Reset button when leaving the screen
    return () => setShowButton(true);
  }, []);
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fonction pour vérifier que le mot de passe a au moins 6 caractères
  const isValidPassword = (password) => {
    return password.length >= 6;
  };
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez entrer votre email et mot de passe.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse e-mail valide.');
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert('Erreur', 'Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    setLoading(true);

    const data = {
      username: email,
      password: password,
      grant_type: 'password',
      client_id: '9d426d4a-a2fa-492b-8735-ec53046ee91d', 
      client_secret: 'ormmGJmrSuioNguKuI4GaW3Iy6wOzkvbTAHZkjo7', 
    };

    try {
      const response = await axios.post("https://students.aic.cm/api/v1/login", data);

      if (response.data.status === 200) {
        const { access_token, refresh_token } = response.data.data;

        // Save tokens to AsyncStorage
        await AsyncStorage.setItem('access_token', access_token);
        await AsyncStorage.setItem('refresh_token', refresh_token);

        setIsAuthenticated(true); // Mark user as authenticated
        Alert.alert('Succès', 'Connexion réussie !');
        router.push('/Home'); // Redirect
      } else {
        Alert.alert('Erreur', response.data.message || 'Erreur lors de la connexion.');
      }
    } catch (error) {
      console.error('Erreur de connexion', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // const handleLogout = async () => {
  //   // Clear tokens from storage on logout
  //   await AsyncStorage.removeItem('access_token');
  //   await AsyncStorage.removeItem('refresh_token');
  //   setIsAuthenticated(false);
  //   Alert.alert('Déconnexion réussie', 'Vous êtes maintenant déconnecté.');
  //   router.push('/'); // Redirect to login screen
  // };

  const handleLogout = async () => {
    try {
      // Récupérer le token d'accès
      const accessToken = await AsyncStorage.getItem('access_token');
  
      if (accessToken) {
        // Configurer l'en-tête d'autorisation
        const config = {
          headers: { Authorization: `Bearer ${accessToken}` }
        };
  
        // Appeler l'API de déconnexion
        await axios.post('https://students.aic.cm/api/v1/logout', {}, config);
      }
  
      // Supprimer les tokens du stockage
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
  
      // Mettre à jour l'état d'authentification (si vous utilisez un contexte d'authentification)
      setIsAuthenticated(false);
  
      Alert.alert('Déconnexion réussie', 'Vous êtes maintenant déconnecté.');
      router.replace('/'); // Rediriger vers l'écran de connexion
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      Alert.alert('Erreur de déconnexion', 'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {!isAuthenticated ? (
            <>
              <View style={styles.logoContainer}>
                <Image
                  source={require('../assets/images/playstore.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.title}>Connexion aic Academy</Text>
                <Text style={styles.subtitle}>
                  Bienvenue ! Connectez-vous à l'aide de votre adresse e-mail pour continuer.
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Adresse électronique"
                  placeholderTextColor={COLORS.gray30}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.inputPassword}
                    placeholder="Mot de passe"
                    placeholderTextColor={COLORS.gray30}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color={COLORS.gray30} 
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                  onPress={handleLogin} 
                  disabled={loading}
                >
                  <Text style={styles.loginButtonText}>
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Connexion'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <><Text style={styles.title}>Vous êtes connecté !</Text>
            <View style={styles.loggedInContainer}>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.secondary,
                    borderRadius: 14,
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 2,
                    shadowColor: '#000',
                  }}
                  onPress={handleLogout}
                >
                  <Text style={styles.loginButtonText}>Déconnexion</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 14,
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    elevation: 2,
                    shadowColor: '#000',
                  }}
                  onPress={() => router.replace('/Home')}
                >
                  <Text style={styles.loginButtonText}>Rester connecté</Text>
                </TouchableOpacity>
              </View></>
          )}
        </ScrollView>
        <View>
          <Text style={{textAlign: 'center', color: COLORS.gray30}}>version 1.0.0,  @aic Sarl</Text>
          <Text style={{textAlign: 'center', color: COLORS.gray30}}>RCCM :CM-DLA-01-2024-B12-00217</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 80,
    marginBottom: -100,
  },
  logo: {
    width: 250,
    height: 250,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loggedInContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
    marginTop: 66,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.gray50,
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F2F2F2',
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.black,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 24,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    height: '100%',
  },
  eyeButton: {
    padding: 5,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

