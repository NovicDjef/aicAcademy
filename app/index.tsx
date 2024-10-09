import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme'; // Assuming you have theme constants set up
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion à aic Academy</Text>
      <Text style={styles.subtitle}>
        Bienvenue ! Connectez-vous à l'aide de votre adresse e-mail pour continuer à vous connecter.
      </Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Adresse électronique"
        placeholderTextColor={COLORS.gray}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={COLORS.gray}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

   

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/Enregistrement')}>
        <Text style={styles.loginButtonText}>Connexion</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.primary, // Assuming primary color is defined in your theme
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: COLORS.gray, // Lighter gray for secondary text
    marginBottom: 30,
  },
  input: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F2F2F2', // Light gray background for input
    marginBottom: 16,
    fontSize: 16,
    color: COLORS.black,
  },
  forgotPassword: {
    textAlign: 'right',
    color: COLORS.primary,
    marginBottom: 30,
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
