import { View, Image, StyleSheet, TouchableOpacity, Text, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {Colors} from '@/constants/Colors'
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/theme';
import axios from 'axios';


export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    Alert.alert('Déconnexion réussie', 'Vous êtes maintenant déconnecté.');
    router.push('/'); 
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token = await AsyncStorage.getItem('access_token');
    
        if (!token) {
          Alert.alert('Erreur', 'Vous devez être connecté pour récupérer les étudiants.');
          return;
        }
    
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        };
    
        // Appel de la requête avec un corps vide `{}` pour éviter l'erreur
        const response = await axios.post('https://students.aic.cm/api/v1/user', {}, config);
        console.log("Réponse de l'utilisateur :", response.data);
    
        if (response.status === 200 && response.data && response.data.data) {
          const usersData = response.data.data;
          setUser(usersData);
        } else {
          Alert.alert('Erreur', "Impossible de récupérer l'agent. Format de réponse inattendu.");
        }
      } catch (error) {
        console.error("Erreur complète :", error);
        Alert.alert('Erreur', `Une erreur est survenue lors de la récupération de l'agent: ${error.message}`);
      }
    };
    
    fetchUserData();
  }, []);
  
  

  console.log("user :", user)
  return (
    <><StatusBar style='dark' /><View style={styles.container}>

      <View style={styles.UserData}>
        {user !== undefined ? (
          <Image
            style={styles.userImage}
            source={require('../assets/images/logo1.png')} />
        ) : (
          <Image
            style={styles.userImage}
            source={require('../assets/images/logo1.png')} />
        )}
        <View style={{ gap: 3, left: 2 }}>
          <Text style={styles.welcomText}>Bienvenue sur Aic Academy</Text>
          <Text style={styles.userName}> Salut, {user ? user.name : 'Agent' }
          </Text>
        </View>
      </View>
      <View style={[styles.icons]}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} style={{ left: 2 }} />
        </TouchableOpacity>
        
      </View>
    </View></>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.primary
  },
  UserData: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcomText: {
    fontSize: 12,
    color: Colors.darkGrey,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black
  },
  Notifications: {
    width: Platform.OS === 'ios' ? 20 : 18,
    height: Platform.OS === 'ios' ? 20 : 18,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    position: 'absolute', 
    top: Platform.OS === 'ios' ? -10 : -9, 
    right: -3,  
    alignItems: 'center',
    justifyContent: 'center',
  },
    logoutButton: {
      top: 0,
      right: 0,
      backgroundColor: COLORS.secondary,
      width: 35,
      height: 35,
      borderRadius: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
})