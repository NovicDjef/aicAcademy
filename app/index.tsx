import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import for persistent storage
import { COLORS } from '@/constants/theme'; 
import { router } from 'expo-router';
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
          router.push('/Enregistrement'); // Redirect to another page
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
        router.push('/Enregistrement'); // Redirect
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

  const handleLogout = async () => {
    // Clear tokens from storage on logout
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    Alert.alert('Déconnexion réussie', 'Vous êtes maintenant déconnecté.');
    router.push('/'); // Redirect to login screen
  };

  return (
    <View style={styles.container}>
      {!isAuthenticated ? (
        <>
          <Image
            source={require('../assets/images/aic2.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Connexion aic Academy</Text>
          <Text style={styles.subtitle}>
            Bienvenue ! Connectez-vous à l'aide  de votre adresse e-mail pour continuer..
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Adresse électronique"
            placeholderTextColor={COLORS.gray30}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.inputPassword}
              placeholder="Mot de passe"
              placeholderTextColor={COLORS.gray30}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}  
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showPasswordText}>
                {showPassword ? <Ionicons name="eye-off" size={24} color={COLORS.gray30} /> : <Ionicons name="eye" size={24} color={COLORS.gray30} />}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
            <Text style={styles.loginButtonText}>
              {loading ? <ActivityIndicator size="small" color="#fff" /> : 'Connexion'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Vous êtes connecté !</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
            <Text style={styles.loginButtonText}>Déconnexion</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    position: 'absolute',
    top: 130,  // Adjust this value to control how close the image is to the top of the screen
    alignSelf: 'center',
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary,
    marginBottom: 16,
    marginTop: 160,  // This ensures there is enough space between the image and the text
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.gray50,
    marginBottom: 30,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
  },
  showPasswordText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 48,
    marginBottom: 16,
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
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
