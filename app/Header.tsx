import { View, Image, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import {Colors} from '@/constants/Colors'
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/theme';


export default function Header() {
  // const UserData = useSelector(state => state.Auth.user)
  // const { UserData, token, isAuthenticated, isLoading, error } = useSelector(state => state.user.auth);
  const router = useRouter();
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userDataString = await AsyncStorage.getItem('userData'); // Récupère la chaîne JSON de `userData`
        
  //       if (userDataString) {
  //         const userData = JSON.parse(userDataString); // Convertit la chaîne JSON en objet
  //         setUser(userData); // Met à jour l'état `user` avec l'objet JSON
  //       }
  //     } catch (error) {
  //       console.error('Error retrieving user data:', error);
  //     }
  //   };
  //   console.log("User :", user)
  //   fetchUserData();  
  // }, []);
  const navigateToFavorites = () => {
    // Naviguer vers la page qui contient le composant Favorite
    router.push('/components/Historique');
  };
  const navigateToNotifications = () => {
    router.push("/components/Notifications")
  }
  return (
    <><StatusBar style='dark' /><View style={styles.container}>

      <View style={styles.UserData}>
        {user !== undefined ? (
          <Image
            style={styles.userImage}
            source={require('../assets/images/icon.png')} />
        ) : (
          <Image
            style={styles.userImage}
            source={require('../assets/images/icon.png')} />
        )}
        <View style={{ gap: 3, left: 2 }}>
          <Text style={styles.welcomText}>Bienvenue sur Aic Academy</Text>
          <Text style={styles.userName}>Salut, {user == undefined ? "Stephane": "Agent"  }
          </Text>
        </View>
      </View>
      <View style={[styles.icons]}>
        <TouchableOpacity onPress={navigateToNotifications}>
          <Ionicons name='notifications-outline' size={24} color={COLORS.black} />
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
    justifyContent: 'center',}
})